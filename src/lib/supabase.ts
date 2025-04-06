
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
