import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Lock, Mail, User, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setError(null);
    try {
      await login(values.email, values.password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <Card className="neo-blur shadow-lg animate-in border-t border-primary/20">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
        Luminova AI
      </div>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-gradient">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <Input placeholder="you@example.com" className="pl-10 bg-background/50 border-muted" {...field} />
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
                  <FormLabel className="text-foreground/80">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 bg-background/50 border-muted"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-right">
              <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t border-border/40 bg-muted/20 rounded-b-lg">
        <div className="text-center text-sm pt-2">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-primary hover:underline font-medium">
            Create account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

// Register form schema with password requirements
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const RegisterForm = () => {
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = form.watch("password");
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setError(null);
    try {
      await register(values.name, values.email, values.password);
      
      // After successful registration, set a flag to show verification message on login page
      sessionStorage.setItem("email_verification_required", "true");
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <Card className="neo-blur shadow-lg animate-in border-t border-primary/20">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
        Luminova AI
      </div>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-gradient">Create Account</CardTitle>
        <CardDescription className="text-center">
          Sign up to start your AI career journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <Input placeholder="John Doe" className="pl-10 bg-background/50 border-muted" {...field} />
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
                  <FormLabel className="text-foreground/80">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <Input placeholder="you@example.com" className="pl-10 bg-background/50 border-muted" {...field} />
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
                  <FormLabel className="text-foreground/80">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 bg-background/50 border-muted"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className={`flex items-center gap-1 ${hasMinLength ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {hasMinLength ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      <span>Min. 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1 ${hasUppercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {hasUppercase ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      <span>Uppercase letter</span>
                    </div>
                    <div className={`flex items-center gap-1 ${hasNumber ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {hasNumber ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      <span>Number</span>
                    </div>
                    <div className={`flex items-center gap-1 ${hasSpecialChar ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {hasSpecialChar ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      <span>Special character</span>
                    </div>
                  </div>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 bg-background/50 border-muted"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-xs text-muted-foreground">
              By creating an account, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t border-border/40 bg-muted/20 rounded-b-lg">
        <div className="text-center text-sm pt-2">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

// Forgot password form schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const ForgotPasswordForm = () => {
  const { forgotPassword, isLoading } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setError(null);
    try {
      await forgotPassword(values.email);
      setEmailSent(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <Card className="neo-blur shadow-lg animate-in border-t border-primary/20">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
        Luminova AI
      </div>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-gradient">Reset Password</CardTitle>
        <CardDescription className="text-center">
          {!emailSent
            ? "Enter your email and we'll send you a link to reset your password"
            : "Check your email for a password reset link"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!emailSent ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                        <Input placeholder="you@example.com" className="pl-10 bg-background/50 border-muted" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center py-4">
            <div className="mb-4 text-primary">
              <Mail className="h-12 w-12 mx-auto" />
            </div>
            <p className="mb-4">We've sent a password reset link to your email.</p>
            <p className="text-sm text-muted-foreground">
              Didn't receive an email? Check your spam folder or{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => setEmailSent(false)}
              >
                try again
              </Button>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t border-border/40 bg-muted/20 rounded-b-lg">
        <div className="text-center text-sm pt-2">
          Remember your password?{" "}
          <Link to="/auth/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

// Removing the email verification banner since we've disabled verification
export const EmailVerificationBanner = () => {
  // Always return null since verification is disabled
  return null;
};
