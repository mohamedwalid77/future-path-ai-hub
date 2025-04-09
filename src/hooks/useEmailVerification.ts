
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export const useEmailVerification = () => {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualVerify, setShowManualVerify] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [connectionError, setConnectionError] = useState(false);
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, verifyEmailWithCode, resendVerificationEmail } = useAuth();

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

  return {
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
  };
};
