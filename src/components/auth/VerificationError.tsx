
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface VerificationErrorProps {
  error: string | null;
}

const VerificationError: React.FC<VerificationErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <Alert className="mb-4 bg-red-500/10 border-red-500/50">
      <AlertCircle className="h-5 w-5 text-red-500" />
      <AlertTitle className="text-red-500">Verification Failed</AlertTitle>
      <AlertDescription className="text-red-400">
        {error}
      </AlertDescription>
    </Alert>
  );
};

export default VerificationError;
