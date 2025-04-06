
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize the Supabase client with explicit error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate Supabase credentials before creating client
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
  );
}

// Create client only if we have valid credentials
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

type User = {
  id: string;
  email: string;
  name: string;
  subscription: "free" | "premium" | null;
  emailVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  supabase: SupabaseClient | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateSubscription: (type: "free" | "premium") => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for session on initial load
  useEffect(() => {
    // If Supabase isn't initialized, show error and exit early
    if (!supabase) {
      setIsLoading(false);
      toast({
        title: "Configuration Error",
        description: "Supabase is not properly configured. Please check your environment variables.",
        variant: "destructive",
      });
      return;
    }

    const getInitialSession = async () => {
      setIsLoading(true);
      
      try {
        // Check active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile data from profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            throw error;
          }
          
          // Map Supabase user to our User type
          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || '',
              subscription: profile.subscription || 'free',
              emailVerified: session.user.email_confirmed_at !== null,
              lastLogin: new Date(session.user.last_sign_in_at || ''),
              createdAt: new Date(profile.created_at || ''),
            });
          }
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getInitialSession();

    // Set up auth state change listener
    let subscription: { unsubscribe: () => void } = { unsubscribe: () => {} };
    
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            // Get user profile from profiles table on sign in
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profile) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profile.name || '',
                subscription: profile.subscription || 'free',
                emailVerified: session.user.email_confirmed_at !== null,
                lastLogin: new Date(session.user.last_sign_in_at || ''),
                createdAt: new Date(profile.created_at || ''),
              });
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        }
      );
      
      subscription = data.subscription;
    }

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // All auth methods now check if supabase is initialized first
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error("Supabase is not initialized");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login successful",
        description: "Welcome back to Luminova AI!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!supabase) {
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
          throw profileError;
        }
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error("Supabase is not initialized");
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error logging out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error("Supabase is not initialized");
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password reset email sent",
        description: `We've sent a password reset link to ${email}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error sending the password reset email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error("Supabase is not initialized");
      }
      
      // In Supabase, the token is handled via the URL so we just update the password
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. Please log in with your new password.",
      });
      
      navigate("/auth/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error resetting your password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (type: "free" | "premium") => {
    if (!user || !supabase) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription: type })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      setUser({ ...user, subscription: type });
      
      toast({
        title: `Subscription updated to ${type}`,
        description: type === "premium" ? "You now have access to premium features!" : "Your subscription has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error updating your subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    // This is handled by Supabase automatically via email verification link
    toast({
      title: "Email verified",
      description: "Your email has been successfully verified.",
    });
  };

  const resendVerificationEmail = async () => {
    setIsLoading(true);
    try {
      if (!user || !supabase) {
        throw new Error("User not logged in or Supabase not initialized");
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Verification email sent",
        description: `We've sent a verification link to ${user.email}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error sending the verification email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    supabase,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateSubscription,
    verifyEmail,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
