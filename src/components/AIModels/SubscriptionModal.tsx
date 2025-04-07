
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type SubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  const { updateSubscription } = useAuth();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubscribe = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      updateSubscription("premium");
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Upgrade to Premium
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Get access to our premium AI career model for only $5 per month.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Advanced Career Path Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Get detailed insights into the best career paths for your skills.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Personalized Learning Recommendations</p>
                <p className="text-sm text-muted-foreground">
                  Customized resources based on your career goals.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Resume and Interview Optimization</p>
                <p className="text-sm text-muted-foreground">
                  AI-powered feedback to maximize your chances of landing the job.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className="inline-flex items-baseline">
              <span className="text-3xl font-bold">$5</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Cancel anytime. No long-term commitment.
            </p>
          </div>
          
          <div className="flex items-center gap-1 justify-center mt-4 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Secure payment processing</span>
          </div>
        </div>
        
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <Button 
            onClick={handleSubscribe} 
            disabled={isProcessing} 
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Subscribe Now - $5/month"}
          </Button>
          <AlertDialogCancel className="w-full sm:w-full mt-0">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubscriptionModal;
