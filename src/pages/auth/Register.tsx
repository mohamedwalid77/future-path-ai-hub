
import React, { useState, useEffect } from "react";
import { RegisterForm } from "@/components/auth/AuthForms";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Database, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { checkDatabaseSetup } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

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
    // Use the actual SQL rather than trying to extract it from the file
    const sqlSchema = `
-- Check if profiles table exists, if not create it
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  email TEXT,
  subscription TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create cv_uploads table
CREATE TABLE IF NOT EXISTS public.cv_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Create cv_analysis table
CREATE TABLE IF NOT EXISTS public.cv_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cv_id UUID REFERENCES cv_uploads(id) NOT NULL,
  skills JSONB,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create job_matches table
CREATE TABLE IF NOT EXISTS public.job_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cv_id UUID REFERENCES cv_uploads(id) NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT,
  match_score INTEGER,
  job_description TEXT,
  match_details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Set up Row Level Security (RLS) policies

-- Profiles: Users can read and update only their own profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- CV Uploads: Users can CRUD only their own CV uploads
ALTER TABLE public.cv_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own CV uploads" 
ON public.cv_uploads FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CV uploads" 
ON public.cv_uploads FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CV uploads" 
ON public.cv_uploads FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CV uploads" 
ON public.cv_uploads FOR DELETE 
USING (auth.uid() = user_id);

-- CV Analysis: Users can CRUD only analyses for their own CVs
ALTER TABLE public.cv_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own CV analyses" 
ON public.cv_analysis FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.cv_uploads
  WHERE cv_uploads.id = cv_analysis.cv_id
  AND cv_uploads.user_id = auth.uid()
));

CREATE POLICY "Users can insert CV analyses for own CVs" 
ON public.cv_analysis FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.cv_uploads
  WHERE cv_uploads.id = cv_analysis.cv_id
  AND cv_uploads.user_id = auth.uid()
));

-- Job Matches: Users can CRUD only job matches for their own CVs
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own job matches" 
ON public.job_matches FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.cv_uploads
  WHERE cv_uploads.id = job_matches.cv_id
  AND cv_uploads.user_id = auth.uid()
));

CREATE POLICY "Users can insert job matches for own CVs" 
ON public.job_matches FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.cv_uploads
  WHERE cv_uploads.id = job_matches.cv_id
  AND cv_uploads.user_id = auth.uid()
));`;
    
    navigator.clipboard.writeText(sqlSchema)
      .then(() => {
        toast({
          title: "SQL Schema copied",
          description: "SQL schema has been copied to your clipboard.",
          variant: "default" // Changed from "success" to "default"
        });
      })
      .catch(err => {
        console.error('Failed to copy schema:', err);
        toast({
          title: "Copy failed",
          description: "Please manually copy the SQL from the code below.",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c14] cyber-grid p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-[#16213e]/20 to-[#0f172a]/30 z-0"></div>
      <div className="max-w-md w-full z-10 relative">
        <div className="text-center mb-8">
          <div className="bg-violet-500/20 p-3 rounded-full w-36 h-36 mx-auto mb-5 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-gradient">Luminova AI</h1>
          </div>
          <p className="text-muted-foreground mt-2">Begin your AI-powered career journey</p>
        </div>
        
        <div className="glass-card p-8 mb-5 rounded-2xl border border-violet-500/20">
          <h2 className="text-3xl font-semibold text-center mb-4 text-white">Create Account</h2>
          <p className="text-center text-gray-400 mb-6">Sign up to start your AI career journey</p>
          
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
          
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account? <Link to="/auth/login" className="text-violet-400 hover:text-violet-300">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
