import { supabase, validateSupabaseClient, checkDatabaseSetup } from '@/lib/supabase';
import { User } from '@/types/auth';
import { toast } from '@/components/ui/use-toast';

export const authService = {
  // Get profile data from Supabase
  async getUserProfile(userId: string): Promise<User | null> {
    if (!validateSupabaseClient() || !supabase) return null;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        if (error.code === '42P01') {  // Relation does not exist
          console.error('The profiles table does not exist:', error);
          toast({
            title: "Database Setup Required",
            description: "The database tables need to be created. Please check the SQL in src/lib/supabase.ts",
            variant: "destructive",
          });
          return null;
        }
        throw error;
      }
      
      if (!profile) return null;
      
      // Get user session to check email verification
      const { data: { session } } = await supabase.auth.getSession();
      
      return {
        id: userId,
        email: profile.email || '',
        name: profile.name || '',
        subscription: profile.subscription || 'free',
        emailVerified: session?.user?.email_confirmed_at !== null,
        lastLogin: new Date(session?.user?.last_sign_in_at || ''),
        createdAt: new Date(profile.created_at || ''),
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },
  
  // Check if database is properly set up
  async checkDatabaseSetup(): Promise<boolean> {
    return checkDatabaseSetup();
  },
  
  // Login with email and password
  async login(email: string, password: string): Promise<User | null> {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    try {
      // First check if database is set up
      const isDbSetup = await this.checkDatabaseSetup();
      if (!isDbSetup) {
        throw new Error("Database not properly set up. Please check the SQL in src/lib/supabase.ts");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) return null;
      
      return this.getUserProfile(data.user.id);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Check if an email exists in the system
  async emailExists(email: string): Promise<boolean> {
    if (!validateSupabaseClient() || !supabase) return false;
    
    try {
      // This is a workaround since Supabase doesn't have a direct "check email exists" endpoint
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      // If there's no error, the email exists
      return !error;
    } catch {
      return false;
    }
  },
  
  // Register a new user
  async register(name: string, email: string, password: string): Promise<User | null> {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    // First check if database is set up
    const isDbSetup = await this.checkDatabaseSetup();
    if (!isDbSetup) {
      toast({
        title: "Database Setup Required",
        description: "The database tables need to be created. Please check the SQL in src/lib/supabase.ts",
        variant: "destructive",
      });
    }
    
    // Sign up the user with Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    });

    if (error) {
      throw error;
    }

    // After signup, create a profile for the user
    if (data.user) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              subscription: 'free',
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          // Check if this is a "relation does not exist" error
          if (profileError.code === '42P01') {
            console.error('The profiles table does not exist:', profileError);
            toast({
              title: "Database Setup Required",
              description: "The database tables need to be created. Please check the SQL in src/lib/supabase.ts",
              variant: "destructive",
            });
            
            // Return basic user even though profile couldn't be created
            return data.user ? {
              id: data.user.id,
              email: email,
              name: name,
              subscription: 'free',
              emailVerified: false,
              lastLogin: new Date(),
              createdAt: new Date(),
            } : null;
          }
          throw profileError;
        }
      } catch (err) {
        console.error('Error creating user profile:', err);
        toast({
          title: "Error Creating Profile",
          description: "Please ensure database tables are created properly.",
          variant: "destructive",
        });
        
        // Return a minimal user object to prevent crashing
        return data.user ? {
          id: data.user.id,
          email: email,
          name: name,
          subscription: 'free',
          emailVerified: false,
          lastLogin: new Date(),
          createdAt: new Date(),
        } : null;
      }
      
      return this.getUserProfile(data.user.id);
    }
    
    return null;
  },
  
  // Logout current user
  async logout(): Promise<void> {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
  },
  
  // Send password reset email
  async forgotPassword(email: string): Promise<void> {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) {
      throw error;
    }
  },
  
  // Reset password with token
  async resetPassword(password: string): Promise<void> {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    // In Supabase, the token is handled via the URL so we just update the password
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      throw error;
    }
  },
  
  // Update user's subscription
  async updateSubscription(userId: string, type: "free" | "premium"): Promise<void> {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription: type })
        .eq('id', userId);
        
      if (error) {
        // Check if this is a "relation does not exist" error
        if (error.code === '42P01') {
          console.error('The profiles table does not exist:', error);
          toast({
            title: "Database Setup Required",
            description: "The database tables need to be created. Please check the SQL in src/lib/supabase.ts",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  },
  
  // Handle email verification
  async verifyEmail(token: string): Promise<void> {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    try {
      // For Supabase, the email verification is mostly handled automatically
      // But we can still check if the verification succeeded
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }
      
      // Additional logic can be added here if needed
      console.log("User verified:", data.user);
      
      // We also navigate and show a toast on successful verification
      // This is handled in the VerifyEmail component
    } catch (error) {
      console.error("Error verifying email:", error);
      throw error;
    }
  },
  
  // Resend verification email
  async resendVerificationEmail(email: string): Promise<void> {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Verification email sent",
      description: "Please check your inbox and spam folder for the verification link",
    });
  },
  
  // Get user's CV uploads
  async getUserCVUploads(userId: string) {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    const { data, error } = await supabase
      .from('cv_uploads')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });
      
    if (error) {
      if (error.code === '42P01') {  // Relation does not exist
        console.error('The cv_uploads table does not exist:', error);
        toast({
          title: "Database Setup Required",
          description: "The CV uploads table needs to be created. Please check the SQL in src/lib/supabase.ts",
          variant: "destructive",
        });
        return [];
      }
      throw error;
    }
    
    return data || [];
  },
  
  // Get job matches for a specific CV
  async getJobMatches(cvId: string) {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    const { data, error } = await supabase
      .from('job_matches')
      .select('*')
      .eq('cv_id', cvId)
      .order('match_score', { ascending: false });
      
    if (error) {
      if (error.code === '42P01') {  // Relation does not exist
        console.error('The job_matches table does not exist:', error);
        toast({
          title: "Database Setup Required",
          description: "The job matches table needs to be created. Please check the SQL in src/lib/supabase.ts",
          variant: "destructive",
        });
        return [];
      }
      throw error;
    }
    
    return data || [];
  },
  
  // Get CV analysis for a specific CV
  async getCVAnalysis(cvId: string) {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    const { data, error } = await supabase
      .from('cv_analysis')
      .select('*')
      .eq('cv_id', cvId)
      .single();
      
    if (error) {
      if (error.code === '42P01') {  // Relation does not exist
        console.error('The cv_analysis table does not exist:', error);
        toast({
          title: "Database Setup Required",
          description: "The CV analysis table needs to be created. Please check the SQL in src/lib/supabase.ts",
          variant: "destructive",
        });
        return null;
      }
      
      // If no records found, it's ok - just means no analysis yet
      if (error.code === 'PGRST116') {
        return null;
      }
      
      throw error;
    }
    
    return data;
  }
};
