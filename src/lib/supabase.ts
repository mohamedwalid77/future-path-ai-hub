
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Initialize the Supabase client with explicit error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate Supabase credentials before creating client
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
  );
}

// Create client only if we have valid credentials
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const validateSupabaseClient = (): boolean => {
  if (!supabase) {
    toast({
      title: "Configuration Error",
      description: "Supabase is not properly configured. Please check your environment variables.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};
