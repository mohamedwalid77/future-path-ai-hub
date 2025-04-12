
import React, { useState } from "react";
import { LoginForm } from "@/components/auth/AuthForms";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [verifyEmailRequired, setVerifyEmailRequired] = useState(false);
  
  // Check if user was redirected here after registration
  React.useEffect(() => {
    const needsVerification = sessionStorage.getItem("email_verification_required");
    if (needsVerification) {
      setVerifyEmailRequired(true);
      sessionStorage.removeItem("email_verification_required");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c14] cyber-grid p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-[#16213e]/20 to-[#0f172a]/30 z-0"></div>
      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gradient">Luminova AI</h1>
          <p className="text-muted-foreground mt-2">Unlock your career potential with AI</p>
        </div>
        
        {verifyEmailRequired && (
          <Alert className="mb-4 bg-amber-500/10 border-amber-500/50">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-500">
              <p>Please verify your email before logging in.</p>
              <p className="text-sm mt-1">Check your inbox for a verification link. If you don't see it, check your spam folder.</p>
            </AlertDescription>
          </Alert>
        )}
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
