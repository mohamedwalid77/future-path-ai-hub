import { supabase, validateSupabaseClient } from '@/lib/supabase';
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
          localStorage.setItem("supabase_profiles_error", "true");
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
  
  // Login with email and password
  async login(email: string, password: string): Promise<User | null> {
    if (!validateSupabaseClient() || !supabase) {
      throw new Error("Supabase is not initialized");
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check for specific error types to provide better messages
        if (error.message === "Invalid login credentials") {
          if (await this.emailExists(email)) {
            // Email exists but credentials are wrong - could be wrong password or unconfirmed email
            // Check if email is verified without using admin API
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password: `temp-${Math.random().toString(36).substring(2, 10)}`, // Random password just to check email status
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
              }
            });
            
            // If we get a "User already registered" error, the email exists but may not be verified
            if (signUpError?.message?.includes("already registered")) {
              throw new Error("Email not verified. Please check your inbox for the verification link or request a new one.");
            }
          }
        }
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
    
    // Sign up the user with Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
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
            localStorage.setItem("supabase_profiles_error", "true");
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
        // If the table doesn't exist but we caught a different error
        localStorage.setItem("supabase_profiles_error", "true");
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
          localStorage.setItem("supabase_profiles_error", "true");
          
          // In demo mode, just return without erroring
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
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
  }
};
