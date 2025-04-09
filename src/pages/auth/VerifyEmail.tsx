
import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import ConnectionErrorAlert from "@/components/auth/ConnectionErrorAlert";
import VerificationSuccess from "@/components/auth/VerificationSuccess";
import VerificationError from "@/components/auth/VerificationError";
import EmailVerificationForm from "@/components/auth/EmailVerificationForm";

const VerifyEmail = () => {
  const {
    verifying,
    success,
    error,
    showManualVerify,
    verificationCode,
    setVerificationCode,
    connectionError,
    lastEmail,
    navigate,
    handleManualVerification,
    handleResendVerificationEmail,
  } = useEmailVerification();

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
            <ConnectionErrorAlert onRetry={() => window.location.reload()} />
          )}
          
          {verifying && !connectionError ? (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">Verifying your email address...</p>
            </div>
          ) : success ? (
            <VerificationSuccess onProceedToLogin={() => navigate("/auth/login?verified=true")} />
          ) : (
            <div>
              <VerificationError error={error} />
              
              {showManualVerify && (
                <EmailVerificationForm
                  error={error}
                  verifying={verifying}
                  verificationCode={verificationCode}
                  setVerificationCode={setVerificationCode}
                  handleManualVerification={handleManualVerification}
                  handleResendVerificationEmail={handleResendVerificationEmail}
                  lastEmail={lastEmail}
                  navigate={navigate}
                />
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
