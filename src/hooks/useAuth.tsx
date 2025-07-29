import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../libs/types.js';
import { databaseService } from '../libs/supabase-service.js';
import { AuthContext } from './auth-context.js';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const currentUser = await databaseService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: signedInUser, error } = await databaseService.signIn(email, password);
      if (signedInUser) {
        setUser(signedInUser);
      }
      return { error };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole = 'client') => {
    setLoading(true);
    try {
      const { user: newUser, error } = await databaseService.signUp(email, password, name, role);
      if (newUser) {
        setUser(newUser);
      }
      return { error };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await databaseService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}