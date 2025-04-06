
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Initialize the Supabase client with explicit error handling
const supabaseUrl = 'https://dzyzxpnpkhsdmgmsuaar.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate Supabase credentials before creating client
if (!supabaseKey) {
  console.error(
    "Supabase anon key is missing. Please set VITE_SUPABASE_ANON_KEY environment variable."
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
      description: "Supabase is not properly configured. Please set your VITE_SUPABASE_ANON_KEY environment variable.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};
