import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Initialize the Supabase client with explicit error handling
const supabaseUrl = 'https://dzyzxpnpkhsdmgmsuaar.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eXp4cG5wa2hzZG1nbXN1YWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NDE1MjYsImV4cCI6MjA1NzIxNzUyNn0.Oz3lnT3j6EN9e8TEeaPSSOyZPh5aF0uwX5jJpSkvLPM';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

export const validateSupabaseClient = (): boolean => {
  if (!supabase) {
    toast({
      title: "Configuration Error",
      description: "Supabase is not properly configured.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

/**
 * DATABASE SCHEMA
 * 
 * The application requires the following tables in Supabase:
 * 
 * 1. profiles (Created by default during auth setup)
 *    - id (uuid, primary key, references auth.users.id)
 *    - name (text)
 *    - email (text)
 *    - subscription (text, either 'free' or 'premium')
 *    - created_at (timestamp with time zone)
 * 
 * 2. cv_uploads
 *    - id (uuid, primary key, default: uuid_generate_v4())
 *    - user_id (uuid, references profiles.id)
 *    - file_name (text)
 *    - file_path (text)
 *    - uploaded_at (timestamp with time zone, default: now())
 * 
 * 3. cv_analysis
 *    - id (uuid, primary key, default: uuid_generate_v4())
 *    - cv_id (uuid, references cv_uploads.id)
 *    - skills (jsonb)
 *    - summary (text)
 *    - created_at (timestamp with time zone, default: now())
 * 
 * 4. job_matches
 *    - id (uuid, primary key, default: uuid_generate_v4())
 *    - cv_id (uuid, references cv_uploads.id)
 *    - job_title (text)
 *    - company (text)
 *    - match_score (integer)
 *    - job_description (text)
 *    - match_details (jsonb)
 *    - created_at (timestamp with time zone, default: now())
 * 
 * SQL to create tables (run in Supabase SQL Editor):
 * 
 * -- Check if profiles table exists, if not create it
 * CREATE TABLE IF NOT EXISTS public.profiles (
 *   id UUID PRIMARY KEY REFERENCES auth.users(id),
 *   name TEXT,
 *   email TEXT,
 *   subscription TEXT DEFAULT 'free',
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 * 
 * -- Create cv_uploads table
 * CREATE TABLE IF NOT EXISTS public.cv_uploads (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES profiles(id) NOT NULL,
 *   file_name TEXT NOT NULL,
 *   file_path TEXT NOT NULL,
 *   uploaded_at TIMESTAMPTZ DEFAULT now()
 * );
 * 
 * -- Create cv_analysis table
 * CREATE TABLE IF NOT EXISTS public.cv_analysis (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   cv_id UUID REFERENCES cv_uploads(id) NOT NULL,
 *   skills JSONB,
 *   summary TEXT,
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 * 
 * -- Create job_matches table
 * CREATE TABLE IF NOT EXISTS public.job_matches (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   cv_id UUID REFERENCES cv_uploads(id) NOT NULL,
 *   job_title TEXT NOT NULL,
 *   company TEXT,
 *   match_score INTEGER,
 *   job_description TEXT,
 *   match_details JSONB,
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 * 
 * -- Set up Row Level Security (RLS) policies
 * 
 * -- Profiles: Users can read and update only their own profiles
 * ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Users can view own profile" 
 * ON public.profiles FOR SELECT 
 * USING (auth.uid() = id);
 * 
 * CREATE POLICY "Users can update own profile" 
 * ON public.profiles FOR UPDATE 
 * USING (auth.uid() = id);
 * 
 * -- CV Uploads: Users can CRUD only their own CV uploads
 * ALTER TABLE public.cv_uploads ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Users can view own CV uploads" 
 * ON public.cv_uploads FOR SELECT 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can insert own CV uploads" 
 * ON public.cv_uploads FOR INSERT 
 * WITH CHECK (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can update own CV uploads" 
 * ON public.cv_uploads FOR UPDATE 
 * USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can delete own CV uploads" 
 * ON public.cv_uploads FOR DELETE 
 * USING (auth.uid() = user_id);
 * 
 * -- CV Analysis: Users can CRUD only analyses for their own CVs
 * ALTER TABLE public.cv_analysis ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Users can view own CV analyses" 
 * ON public.cv_analysis FOR SELECT 
 * USING (EXISTS (
 *   SELECT 1 FROM public.cv_uploads
 *   WHERE cv_uploads.id = cv_analysis.cv_id
 *   AND cv_uploads.user_id = auth.uid()
 * ));
 * 
 * CREATE POLICY "Users can insert CV analyses for own CVs" 
 * ON public.cv_analysis FOR INSERT 
 * WITH CHECK (EXISTS (
 *   SELECT 1 FROM public.cv_uploads
 *   WHERE cv_uploads.id = cv_analysis.cv_id
 *   AND cv_uploads.user_id = auth.uid()
 * ));
 * 
 * -- Job Matches: Users can CRUD only job matches for their own CVs
 * ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Users can view own job matches" 
 * ON public.job_matches FOR SELECT 
 * USING (EXISTS (
 *   SELECT 1 FROM public.cv_uploads
 *   WHERE cv_uploads.id = job_matches.cv_id
 *   AND cv_uploads.user_id = auth.uid()
 * ));
 * 
 * CREATE POLICY "Users can insert job matches for own CVs" 
 * ON public.job_matches FOR INSERT 
 * WITH CHECK (EXISTS (
 *   SELECT 1 FROM public.cv_uploads
 *   WHERE cv_uploads.id = job_matches.cv_id
 *   AND cv_uploads.user_id = auth.uid()
 * ));
 */

// Helper function to check if the database tables exist
export const checkDatabaseSetup = async (): Promise<boolean> => {
  if (!validateSupabaseClient()) return false;
  
  try {
    // Check if the profiles table exists and has content
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (profilesError) {
      console.error('Error checking profiles table:', profilesError);
      
      // Check specific error codes for table not existing
      if (profilesError.code === '42P01') { // Table does not exist
        localStorage.setItem('supabase_profiles_error', 'true');
        toast({
          title: "Database Setup Required",
          description: "The database tables need to be created. Please run the SQL in the Supabase SQL Editor.",
          variant: "destructive",
        });
        return false;
      }
      
      // Other errors
      toast({
        title: "Database Connection Error",
        description: profilesError.message,
        variant: "destructive",
      });
      return false;
    }
    
    // Next check cv_uploads table
    const { error: cvUploadsError } = await supabase
      .from('cv_uploads')
      .select('id')
      .limit(1);
      
    if (cvUploadsError && cvUploadsError.code === '42P01') {
      localStorage.setItem('supabase_profiles_error', 'true');
      toast({
        title: "Database Setup Required",
        description: "CV Uploads table is missing. Please run the complete SQL setup.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking database setup:', error);
    return false;
  }
};
