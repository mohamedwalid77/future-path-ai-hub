import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType } from "@/types/auth";
import { supabase, validateSupabaseClient } from "@/lib/supabase";
import { authService } from "@/services/authService";
import { useAuthState } from "@/hooks/useAuthState";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuthState();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Display a warning if Supabase is not configured
  const isSupabaseConfigured = !!supabase;

  const login = async (email: string, password: string) => {
    if (!validateSupabaseClient()) {
      return;
    }
    
    try {
      await authService.login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to Luminova AI!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      // Improve error messages for better user experience
      let errorMessage = error.message;
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "The email or password you entered is incorrect.";
      } else if (error.message.includes("Email not verified")) {
        // TEMPORARILY BYPASS EMAIL VERIFICATION
        // Instead of showing error, let's log in the user
        try {
          await authService.login(email, password, true); // Adding a bypass flag
          toast({
            title: "Login successful",
            description: "Welcome back to Luminova AI!",
          });
          navigate("/dashboard");
          return;
        } catch (innerError: any) {
          errorMessage = "Login failed. Please check your credentials.";
        }
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    if (!validateSupabaseClient()) {
      return;
    }
    
    try {
      await authService.register(name, email, password);
      
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
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      
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
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
      
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
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await authService.resetPassword(password);
      
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
    }
  };

  const updateSubscription = async (type: "free" | "premium") => {
    if (!user || !validateSupabaseClient()) return;
    
    try {
      await authService.updateSubscription(user.id, type);
      
      // Update local user state
      if (user) {
        user.subscription = type;
      }
      
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
    }
  };

  const verifyEmail = async (token: string) => {
    // TEMPORARILY DISABLED
    toast({
      title: "Email verification bypassed",
      description: "Email verification is currently disabled.",
    });
    navigate("/auth/login");
  };

  const resendVerificationEmail = async () => {
    // TEMPORARILY DISABLED
    toast({
      title: "Email verification disabled",
      description: "Email verification is currently disabled during development.",
    });
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
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

  return (
    <AuthContext.Provider value={value}>
      {!isSupabaseConfigured && !isLoading && (
        <div className="fixed top-20 inset-x-0 p-4 z-50">
          <Alert variant="destructive" className="max-w-3xl mx-auto">
            <AlertTitle>Supabase Configuration Missing</AlertTitle>
            <AlertDescription>
              The app requires Supabase environment variables to function properly. 
              Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
            </AlertDescription>
          </Alert>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};
