
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface EmailVerificationFormProps {
  error: string | null;
  verifying: boolean;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  handleManualVerification: () => Promise<void>;
  handleResendVerificationEmail: () => Promise<void>;
  lastEmail: string | null;
  navigate: (path: string) => void;
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  error,
  verifying,
  verificationCode,
  setVerificationCode,
  handleManualVerification,
  handleResendVerificationEmail,
  lastEmail,
  navigate,
}) => {
  return (
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
  );
};

export default EmailVerificationForm;
