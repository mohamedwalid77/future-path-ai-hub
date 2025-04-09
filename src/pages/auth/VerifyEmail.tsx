
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualVerify, setShowManualVerify] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [connectionError, setConnectionError] = useState(false);
  const { verifyEmail, verifyEmailWithCode, resendVerificationEmail } = useAuth();
  const [lastEmail, setLastEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have stored email
    const email = sessionStorage.getItem("last_email");
    if (email) {
      setLastEmail(email);
    }

    // Check connection to Supabase
    const checkConnection = async () => {
      try {
        // Simple ping to check if we can connect
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
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
          setVerifying(false);
          setShowManualVerify(true);
          setError("Connection error. Please check your internet connection.");
          return;
        }
      } catch (error) {
        console.error("Connection check error:", error);
        setConnectionError(true);
        setVerifying(false);
        setShowManualVerify(true);
        setError("Connection error. Please check your internet connection.");
        return;
      }
    };

    const verify = async () => {
      try {
        // Check connection first
        await checkConnection();
        if (connectionError) return;

        // Extract token from URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (!token) {
          setError("Verification link is invalid or has expired.");
          setVerifying(false);
          setShowManualVerify(true);
          return;
        }

        if (type === 'signup' || type === 'recovery') {
          await verifyEmail(token);
          setSuccess(true);
        } else {
          setError("Unknown verification type.");
          setShowManualVerify(true);
        }
      } catch (error: any) {
        setError(error.message || "Failed to verify email. Please try again.");
        setShowManualVerify(true);
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [searchParams, verifyEmail, connectionError]);

  const handleManualVerification = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter a verification code");
      return;
    }

    try {
      setVerifying(true);
      // Check connection first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        await fetch('https://dzyzxpnpkhsdmgmsuaar.supabase.co', { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (e) {
        throw new Error("Connection error. Please check your internet connection.");
      }
      
      await verifyEmailWithCode(verificationCode);
      setSuccess(true);
      setError(null);
      setShowManualVerify(false);
      
      toast({
        title: "Email verified successfully",
        description: "You can now log in to your account with full access.",
      });
    } catch (error: any) {
      setError(error.message || "Failed to verify email with code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!lastEmail) {
      setError("No email address found. Please go back to login.");
      return;
    }
    
    try {
      await resendVerificationEmail(lastEmail);
      
      // Show verification code for testing
      const code = localStorage.getItem('email_verification_code');
      if (code) {
        toast({
          title: "Verification code",
          description: `For testing purposes, your verification code is: ${code}`,
          variant: "default",
        });
      }
    } catch (error: any) {
      setError(error.message || "Failed to resend verification email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c14] cyber-grid p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-[#16213e]/20 to-[#0f172a]/30 z-0"></div>
      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gradient">Luminova AI</h1>
          <p className="text-muted-foreground mt-2">Email Verification</p>
        </div>

        <div className="glass-card border border-violet-500/20 shadow-md rounded-lg p-6">
          {connectionError && (
            <Alert className="mb-4 bg-red-500/10 border-red-500/50">
              <WifiOff className="h-5 w-5 text-red-500" />
              <AlertTitle className="text-red-500">Connection Error</AlertTitle>
              <AlertDescription>
                <p className="mb-4 text-red-400">Unable to connect to our services. Please check your internet connection and try again.</p>
                <Button 
                  variant="outline" 
                  className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10" 
                  onClick={() => window.location.reload()}
                >
                  Retry Connection
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {verifying && !connectionError ? (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">Verifying your email address...</p>
            </div>
          ) : success ? (
            <Alert className="bg-green-500/10 border-green-500/30 mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-green-500">Email verified successfully!</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4 text-green-400">Your email has been verified. You can now log in to your account.</p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/auth/login?verified=true")}
                >
                  Proceed to Login
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <div>
              {error && (
                <Alert className="mb-4 bg-red-500/10 border-red-500/50">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <AlertTitle className="text-red-500">Verification Failed</AlertTitle>
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              {showManualVerify && (
                <div className="mt-4">
                  <Alert className="mb-4 bg-amber-500/10 border-amber-500/50">
                    <AlertTitle className="text-amber-500">Manual Verification</AlertTitle>
                    <AlertDescription className="text-amber-400">
                      Enter the verification code from your email below.
                      {localStorage.getItem('email_verification_code') && (
                        <p className="mt-2 p-2 bg-slate-800 rounded text-white">
                          <strong>For testing:</strong> Your verification code is: {localStorage.getItem('email_verification_code')}
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="verification-code" className="text-white">Verification Code</Label>
                      <Input
                        id="verification-code"
                        placeholder="Enter the code from your email"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="bg-[#1a1a2e] border-violet-500/30 focus:border-violet-500"
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleManualVerification}
                      disabled={verifying}
                    >
                      {verifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>
                    
                    {lastEmail && (
                      <Button
                        variant="outline"
                        className="w-full mt-2 border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                        onClick={handleResendVerificationEmail}
                      >
                        Resend Verification Email
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                      onClick={() => navigate("/auth/login")}
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              )}
              
              {!showManualVerify && (
                <div className="flex flex-col space-y-3">
                  <Button 
                    variant="outline" 
                    className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                    onClick={() => navigate("/auth/login")}
                  >
                    Back to Login
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
