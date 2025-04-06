
import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AuthContextType } from "@/types/auth";
import { supabase } from "@/lib/supabase";
import { authService } from "@/services/authService";
import { useAuthState } from "@/hooks/useAuthState";

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

  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      
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
    }
  };

  const register = async (name: string, email: string, password: string) => {
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
    if (!user) return;
    
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
    // This is handled by Supabase automatically via email verification link
    toast({
      title: "Email verified",
      description: "Your email has been successfully verified.",
    });
  };

  const resendVerificationEmail = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await authService.resendVerificationEmail(user.email);
      
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
    }
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
