
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
import { AlertCircle, Mail, CheckCircle2, Eye, EyeOff, User, Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Email Verification Banner Component
export const EmailVerificationBanner = () => {
  const { user, resendVerificationEmail } = useAuth();
  const [sending, setSending] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);

  // Only show for users who haven't verified their email
  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendEmail = async () => {
    try {
      setSending(true);
      await resendVerificationEmail();
      
      // Show the verification code from localStorage (for demo purposes)
      const code = localStorage.getItem('email_verification_code');
      if (code) {
        toast({
          title: "Verification code",
          description: `Your verification code is: ${code}`,
          variant: "default",
        });
      }
      
      setShowVerificationCode(true);
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
        {showVerificationCode && (
          <p className="mb-2 font-semibold">
            Check your email for the verification code. For testing, your code is: {localStorage.getItem('email_verification_code')}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
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
          <Button
            variant="outline"
            size="sm"
            className="text-amber-500 border-amber-500/50 hover:bg-amber-500/10"
            onClick={() => window.location.href = "/auth/verify-email"}
          >
            Enter Verification Code
          </Button>
        </div>
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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

  // Check if password meets criteria
  const passwordValue = form.watch("password") || "";
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    placeholder="John Doe" 
                    {...field} 
                    className="pl-10 bg-[#151525] border-[#2a2a40] focus:border-violet-500 h-12"
                  />
                </div>
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
              <FormLabel className="text-gray-300">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    placeholder="you@example.com" 
                    {...field} 
                    className="pl-10 bg-[#151525] border-[#2a2a40] focus:border-violet-500 h-12"
                  />
                </div>
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
              <FormLabel className="text-gray-300">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...field} 
                    className="pl-10 pr-10 bg-[#151525] border-[#2a2a40] focus:border-violet-500 h-12"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${hasMinLength ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <span>Min. 8 characters</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${hasUppercase ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <span>Uppercase letter</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${hasNumber ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <span>Number</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${hasSpecial ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <span>Special character</span>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...field} 
                    className="pl-10 pr-10 bg-[#151525] border-[#2a2a40] focus:border-violet-500 h-12"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <p className="text-xs text-gray-400 mt-2">
          By creating an account, you agree to our <a href="#" className="text-violet-400 hover:underline">Terms of Service</a> and <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>.
        </p>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button 
          type="submit" 
          className="w-full h-12 bg-violet-500 hover:bg-violet-600 text-white"
          disabled={isLoading}
        >
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
  const [showPassword, setShowPassword] = useState(false);
  
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    placeholder="you@example.com" 
                    {...field} 
                    className="pl-10 bg-[#151525] border-[#2a2a40] focus:border-violet-500 h-12"
                  />
                </div>
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
              <FormLabel className="text-gray-300">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...field} 
                    className="pl-10 pr-10 bg-[#151525] border-[#2a2a40] focus:border-violet-500 h-12"
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <a href="/auth/forgot-password" className="text-violet-400 hover:text-violet-300 text-sm">
            Forgot password?
          </a>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button 
          type="submit" 
          className="w-full h-12 bg-violet-500 hover:bg-violet-600 text-white"
          disabled={isLoading}
        >
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
