
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateSubscription: (type: "free" | "premium") => void;
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

  useEffect(() => {
    // Check if the user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulating API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, just check if email and password are not empty
      if (email && password) {
        // Get user from localStorage if exists or create a mock user for demonstration
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const userMatch = existingUsers.find((u: any) => u.email === email);
        
        if (!userMatch) {
          throw new Error("User not found");
        }
        
        if (userMatch.password !== password) {
          throw new Error("Invalid credentials");
        }
        
        // Update last login time
        userMatch.lastLogin = new Date();
        
        // Update the user in localStorage
        localStorage.setItem("users", JSON.stringify(
          existingUsers.map((u: any) => u.email === email ? userMatch : u)
        ));
        
        // Remove password before storing in user state
        const { password: _, ...userWithoutPassword } = userMatch;
        
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        
        toast({
          title: "Login successful",
          description: "Welcome back to Luminova AI!",
        });
        
        navigate("/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulating API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      if (existingUsers.some((u: any) => u.email === email)) {
        throw new Error("Email already registered");
      }
      
      // Create a mock user for demonstration
      const newUser = {
        id: "user-" + Date.now(),
        email,
        name,
        password, // In a real app, this would be hashed
        subscription: "free",
        emailVerified: false,
        lastLogin: new Date(),
        createdAt: new Date(),
      };
      
      // Store in "database"
      localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
      
      // Remove password before storing in user state
      const { password: _, ...userWithoutPassword } = newUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      // Send verification email
      await sendVerificationEmail(email);
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Check if user exists
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = existingUsers.some((u: any) => u.email === email);
      
      if (!userExists) {
        throw new Error("Email not found");
      }
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, send reset link via email
      toast({
        title: "Password reset email sent",
        description: `We've sent a password reset link to ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error sending the password reset email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, validate token and update password
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. Please log in with your new password.",
      });
      
      navigate("/auth/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error resetting your password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = (type: "free" | "premium") => {
    if (user) {
      const updatedUser = { ...user, subscription: type };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update in "database"
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      localStorage.setItem("users", JSON.stringify(
        existingUsers.map((u: any) => u.id === user.id ? { ...u, subscription: type } : u)
      ));
      
      toast({
        title: `Subscription updated to ${type}`,
        description: type === "premium" ? "You now have access to premium features!" : "Your subscription has been updated.",
      });
    }
  };

  const sendVerificationEmail = async (email: string) => {
    // In a real app, this would send an actual email
    console.log(`Sending verification email to ${email}`);
    
    // Generate verification token
    const token = Math.random().toString(36).substring(2, 15);
    
    // Store token in localStorage for demo purposes
    const verificationTokens = JSON.parse(localStorage.getItem("verificationTokens") || "{}");
    verificationTokens[email] = token;
    localStorage.setItem("verificationTokens", JSON.stringify(verificationTokens));
    
    toast({
      title: "Verification email sent",
      description: `We've sent a verification link to ${email}`,
    });
    
    return token;
  };

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error("User not logged in");
      }
      
      // Get verification tokens from localStorage
      const verificationTokens = JSON.parse(localStorage.getItem("verificationTokens") || "{}");
      
      if (verificationTokens[user.email] !== token) {
        throw new Error("Invalid verification token");
      }
      
      // Update user emailVerified status
      const updatedUser = { ...user, emailVerified: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update in "database"
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      localStorage.setItem("users", JSON.stringify(
        existingUsers.map((u: any) => u.id === user.id ? { ...u, emailVerified: true } : u)
      ));
      
      // Remove verification token
      delete verificationTokens[user.email];
      localStorage.setItem("verificationTokens", JSON.stringify(verificationTokens));
      
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified.",
      });
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "There was an error verifying your email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("User not logged in");
      }
      
      await sendVerificationEmail(user.email);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error sending the verification email.",
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
