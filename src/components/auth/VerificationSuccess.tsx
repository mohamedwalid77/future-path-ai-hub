
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationSuccessProps {
  onProceedToLogin: () => void;
}

const VerificationSuccess: React.FC<VerificationSuccessProps> = ({ onProceedToLogin }) => {
  return (
    <Alert className="bg-green-500/10 border-green-500/30 mb-4">
      <CheckCircle2 className="h-5 w-5 text-green-500" />
      <AlertTitle className="text-green-500">Email verified successfully!</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4 text-green-400">Your email has been verified. You can now log in to your account.</p>
        <Button 
          className="w-full" 
          onClick={onProceedToLogin}
        >
          Proceed to Login
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default VerificationSuccess;
