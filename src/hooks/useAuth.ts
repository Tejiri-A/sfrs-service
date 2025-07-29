// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../libs/supabase.ts";

type AuthUser = User & { role?: string };

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      const currentUser = session?.user ?? null;

      if (currentUser) {
        // Get user role from public.users table
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("auth_id", currentUser.id)
          .single();

        setUser({
          ...currentUser,
          role: userData?.role || "client",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Check current session on initial load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("auth_id", session.user.id)
          .single();

        setUser({
          ...session.user,
          role: userData?.role || "client",
        });
      }
      setLoading(false);
    };

    checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, signOut, setUser };
}