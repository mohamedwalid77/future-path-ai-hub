
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const verify = async () => {
      try {
        // Extract token from URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (!token) {
          setError("Verification link is invalid or has expired.");
          setVerifying(false);
          return;
        }

        if (type === 'signup' || type === 'recovery') {
          await verifyEmail(token);
          setSuccess(true);
        } else {
          setError("Unknown verification type.");
        }
      } catch (error: any) {
        setError(error.message || "Failed to verify email. Please try again.");
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [searchParams, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c14] cyber-grid p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-[#16213e]/20 to-[#0f172a]/30 z-0"></div>
      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gradient">Luminova AI</h1>
          <p className="text-muted-foreground mt-2">Email Verification</p>
        </div>

        <div className="bg-card border shadow-md rounded-lg p-6">
          {verifying ? (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">Verifying your email address...</p>
            </div>
          ) : success ? (
            <Alert className="bg-green-500/10 border-green-500/30 mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-green-500">Email verified successfully!</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">Your email has been verified. You can now log in to your account.</p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/auth/login")}
                >
                  Proceed to Login
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">{error || "There was a problem verifying your email."}</p>
                <div className="flex flex-col space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/auth/login")}
                  >
                    Back to Login
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
