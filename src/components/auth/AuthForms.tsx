
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Email Verification Banner Component
export const EmailVerificationBanner = () => {
  const { user, resendVerificationEmail } = useAuth();
  const [sending, setSending] = useState(false);

  // Only show for users who haven't verified their email
  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendEmail = async () => {
    try {
      setSending(true);
      await resendVerificationEmail();
      toast({
        title: "Verification email sent",
        description: "Please check your inbox or spam folder.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Alert variant="default" className="mb-4 bg-amber-500/10 border-amber-500/50">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-500">Verify your email</AlertTitle>
      <AlertDescription className="text-amber-500">
        <p className="mb-2">Please verify your email address to access all features.</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-amber-500 border-amber-500/50 hover:bg-amber-500/10"
          onClick={handleResendEmail}
          disabled={sending}
        >
          <Mail className="h-3 w-3 mr-1" />
          {sending ? "Sending..." : "Resend verification email"}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // path of error
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      setError(null);
      await register(values.name, values.email, values.password);
      
      // Store email for verification purposes
      sessionStorage.setItem("email_verification_required", "true");
      sessionStorage.setItem("last_email", values.email);
      
      // Redirect to login page with message about verification
      navigate("/auth/login");
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
};

const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    try {
      setError(null);
      await login(values.email, values.password);
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

// Forgot Password Form Component
export const ForgotPasswordForm = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await forgotPassword(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {success ? (
        <Alert className="bg-green-500/10 border-green-500/30">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">
            <p className="mb-4">Password reset instructions have been sent to your email.</p>
            <Button 
              onClick={() => navigate("/auth/login")} 
              className="w-full"
            >
              Return to Login
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending Instructions..." : "Send Reset Instructions"}
          </Button>
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              className="text-primary"
              onClick={() => navigate("/auth/login")}
            >
              Back to Login
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
