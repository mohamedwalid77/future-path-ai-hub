
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth';
import { authService } from '@/services/authService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // If Supabase isn't initialized, exit early
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const getInitialSession = async () => {
      setIsLoading(true);
      
      try {
        // Check active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          const userData = await authService.getUserProfile(session.user.id);
          
          // Ensure userData is verified for development purposes
          if (userData) {
            userData.emailVerified = true;
          }
          
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getInitialSession();

    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userData = await authService.getUserProfile(session.user.id);
          
          // Always set emailVerified to true for development
          if (userData) {
            userData.emailVerified = true;
          }
          
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    const subscription = data.subscription;

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading, isAuthenticated: !!user };
};
