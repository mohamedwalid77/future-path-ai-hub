
import React, { useState } from "react";
import { RegisterForm } from "@/components/auth/AuthForms";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [dbSetupError, setDbSetupError] = useState(false);

  // Check for error in localStorage that might be set by authService
  React.useEffect(() => {
    const profilesError = localStorage.getItem("supabase_profiles_error");
    if (profilesError) {
      setDbSetupError(true);
      // Clear the error flag after showing the message
      localStorage.removeItem("supabase_profiles_error");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c14] cyber-grid p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-[#16213e]/20 to-[#0f172a]/30 z-0"></div>
      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gradient">Luminova AI</h1>
          <p className="text-muted-foreground mt-2">Begin your AI-powered career journey</p>
        </div>
        
        {dbSetupError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p>Database setup incomplete. The "profiles" table is missing.</p>
              <p className="mt-2">Please make sure you have set up the Supabase database properly by:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Creating a "profiles" table with fields: id, name, email, subscription, created_at</li>
                <li>Setting up proper permissions for the table</li>
              </ol>
              <p className="mt-2">
                <Link to="/auth/login" className="underline text-primary">
                  Return to login
                </Link>
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
