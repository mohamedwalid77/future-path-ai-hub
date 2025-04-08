
import React, { useState, useEffect } from "react";
import { RegisterForm } from "@/components/auth/AuthForms";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Database, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { checkDatabaseSetup } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Register = () => {
  const [dbSetupError, setDbSetupError] = useState(false);
  const [isCheckingDb, setIsCheckingDb] = useState(true);

  // Check for error in localStorage that might be set by authService
  useEffect(() => {
    const checkDb = async () => {
      setIsCheckingDb(true);
      
      // Check for profile error in localStorage
      const profilesError = localStorage.getItem("supabase_profiles_error");
      if (profilesError) {
        setDbSetupError(true);
        // Clear the error flag after showing the message
        localStorage.removeItem("supabase_profiles_error");
      } else {
        // Also check database setup directly
        try {
          const isSetup = await checkDatabaseSetup();
          if (!isSetup) {
            setDbSetupError(true);
          }
        } catch (error) {
          console.error("Database check failed:", error);
          setDbSetupError(true);
        }
      }
      
      setIsCheckingDb(false);
    };
    
    checkDb();
  }, []);

  const copySchemaToClipboard = () => {
    // Find SQL schema comment in supabase.ts
    const schemaStart = `-- Check if profiles table exists, if not create it`;
    const schemaEnd = `ON public.job_matches FOR INSERT`;
    
    fetch('/src/lib/supabase.ts')
      .then(response => response.text())
      .then(text => {
        const start = text.indexOf(schemaStart);
        const end = text.indexOf(schemaEnd) + schemaEnd.length;
        
        if (start !== -1 && end !== -1) {
          const schema = text.substring(start, end);
          navigator.clipboard.writeText(schema)
            .then(() => {
              alert("SQL Schema copied to clipboard!");
            })
            .catch(err => {
              console.error('Failed to copy schema:', err);
              alert("Failed to copy. Please manually copy from src/lib/supabase.ts");
            });
        } else {
          alert("Couldn't find SQL schema. Please manually copy from src/lib/supabase.ts");
        }
      })
      .catch(err => {
        console.error('Error fetching supabase.ts:', err);
        alert("Error fetching schema. Please manually copy from src/lib/supabase.ts");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c14] cyber-grid p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-[#16213e]/20 to-[#0f172a]/30 z-0"></div>
      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gradient">Luminova AI</h1>
          <p className="text-muted-foreground mt-2">Begin your AI-powered career journey</p>
        </div>
        
        {isCheckingDb ? (
          <div className="text-center p-4 mb-4 bg-primary/10 rounded-md animate-pulse">
            <p>Checking database configuration...</p>
          </div>
        ) : dbSetupError ? (
          <Alert variant="destructive" className="mb-4 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-destructive font-semibold">Database Setup Required</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-3">The database tables need to be created. Please follow these steps:</p>
              <ol className="list-decimal pl-5 space-y-2 mb-3">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to the SQL Editor</li>
                <li>Click the button below to copy the SQL script</li>
                <li>Paste and run the SQL script to create all required tables</li>
              </ol>
              
              <Button 
                className="w-full mb-3 bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30"
                onClick={copySchemaToClipboard}
              >
                <Database className="h-4 w-4 mr-2" />
                Copy SQL Schema to Clipboard
              </Button>
              
              <Separator className="my-3 bg-destructive/30" />
              
              <div className="flex items-center p-2 bg-red-950/50 rounded">
                <Database className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  Required tables: profiles, cv_uploads, cv_analysis, job_matches
                </span>
              </div>
              
              <div className="mt-3 flex justify-between">
                <Link to="/auth/login" className="flex items-center text-primary hover:underline">
                  <span>Return to login</span>
                </Link>
                <a 
                  href="https://app.supabase.com/projects" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <span>Go to Supabase</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <RegisterForm />
        )}
      </div>
    </div>
  );
};

export default Register;
