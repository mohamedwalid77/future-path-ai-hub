
import React, { useState, useEffect } from "react";
import { RegisterForm } from "@/components/auth/AuthForms";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { checkDatabaseSetup } from "@/lib/supabase";

const Register = () => {
  const [dbSetupError, setDbSetupError] = useState(false);

  // Check for error in localStorage that might be set by authService
  useEffect(() => {
    const profilesError = localStorage.getItem("supabase_profiles_error");
    if (profilesError) {
      setDbSetupError(true);
      // Clear the error flag after showing the message
      localStorage.removeItem("supabase_profiles_error");
    }
    
    // Also check database setup directly
    const checkDbSetup = async () => {
      const isSetup = await checkDatabaseSetup();
      if (!isSetup) {
        setDbSetupError(true);
      }
    };
    
    checkDbSetup();
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
              <p className="font-semibold">Database Setup Required</p>
              <p className="mt-2">The database tables need to be created. Please follow these steps:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to the SQL Editor</li>
                <li>Copy the SQL from <code>src/lib/supabase.ts</code></li>
                <li>Run the SQL script to create all required tables</li>
              </ol>
              <div className="flex items-center mt-3 p-2 bg-red-950/50 rounded">
                <Database className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  Required tables: profiles, cv_uploads, cv_analysis, job_matches
                </span>
              </div>
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
