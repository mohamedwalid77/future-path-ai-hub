
import React, { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/AuthForms";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Mail, WifiOff } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [verifyEmailRequired, setVerifyEmailRequired] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [searchParams] = useSearchParams();
  const { resendVerificationEmail } = useAuth();
  
  // Check if user was redirected here after registration or verification
  useEffect(() => {
    // Check connection to Supabase
    const checkConnection = async () => {
      try {
        // Simple ping to check if we can connect
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        await fetch('https://dzyzxpnpkhsdmgmsuaar.supabase.co', { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        setConnectionError(false);
      } catch (error) {
        console.error("Connection error:", error);
        setConnectionError(true);
      }
    };
    
    checkConnection();
    
    // Check for registration redirect
    const needsVerification = sessionStorage.getItem("email_verification_required");
    if (needsVerification) {
      setVerifyEmailRequired(true);
      const email = sessionStorage.getItem("last_email");
      if (email) {
        setLastEmail(email);
      }
      sessionStorage.removeItem("email_verification_required");
    }
    
    // Check for verified flag from email verification
    const verified = searchParams.get("verified");
    if (verified === "true") {
      setEmailVerified(true);
    }
  }, [searchParams]);

  const handleResendVerification = () => {
    if (lastEmail) {
      resendVerificationEmail(lastEmail);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c14] cyber-grid p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-[#16213e]/20 to-[#0f172a]/30 z-0"></div>
      <div className="max-w-md w-full z-10 relative">
        <div className="text-center mb-8">
          <div className="bg-violet-500/20 p-3 rounded-full w-36 h-36 mx-auto mb-5 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-gradient">Luminova AI</h1>
          </div>
          <p className="text-muted-foreground mt-2">Unlock your career potential with AI</p>
        </div>
        
        <div className="glass-card p-8 mb-5 rounded-2xl border border-violet-500/20">
          <h2 className="text-3xl font-semibold text-center mb-4 text-white">Login</h2>
          <p className="text-center text-gray-400 mb-6">Access your AI-powered career tools</p>

          {connectionError && (
            <Alert className="mb-4 bg-red-500/10 border-red-500/50">
              <WifiOff className="h-4 w-4 text-red-500" />
              <AlertDescription>
                <p className="text-red-500 font-medium">Unable to connect to our services</p>
                <p className="text-sm mt-1 text-red-400">
                  Please check your internet connection and try again. If the problem persists, 
                  our servers might be temporarily unavailable.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-red-500 border-red-500/50 hover:bg-red-500/10"
                  onClick={() => window.location.reload()}
                >
                  Retry Connection
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {emailVerified && (
            <Alert className="mb-4 bg-green-500/10 border-green-500/30">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                <p>Your email has been successfully verified! You can now log in.</p>
              </AlertDescription>
            </Alert>
          )}
          
          {verifyEmailRequired && (
            <Alert className="mb-4 bg-amber-500/10 border-amber-500/50">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-500">
                <p>Please verify your email before logging in.</p>
                <p className="text-sm mt-1">Check your inbox for a verification link or code. If you don't see it, check your spam folder.</p>
                <div className="flex gap-2 mt-2">
                  {lastEmail && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-amber-500 border-amber-500/50 hover:bg-amber-500/10"
                      onClick={handleResendVerification}
                    >
                      <Mail className="h-3 w-3 mr-1" /> Resend Email
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-amber-500 border-amber-500/50 hover:bg-amber-500/10"
                    asChild
                  >
                    <Link to="/auth/verify-email">Enter Verification Code</Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <LoginForm />
          
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account? <Link to="/auth/register" className="text-violet-400 hover:text-violet-300">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
