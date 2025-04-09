
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionErrorAlertProps {
  onRetry: () => void;
}

const ConnectionErrorAlert: React.FC<ConnectionErrorAlertProps> = ({ onRetry }) => {
  return (
    <Alert className="mb-4 bg-red-500/10 border-red-500/50">
      <WifiOff className="h-5 w-5 text-red-500" />
      <AlertTitle className="text-red-500">Connection Error</AlertTitle>
      <AlertDescription>
        <p className="mb-4 text-red-400">Unable to connect to our services. Please check your internet connection and try again.</p>
        <Button 
          variant="outline" 
          className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10" 
          onClick={onRetry}
        >
          Retry Connection
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionErrorAlert;
