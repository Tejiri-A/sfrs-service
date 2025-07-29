// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../libs/supabase.ts";
import { ROUTES } from "../libs/constants.ts";
import { toast } from "sonner";
 // Assume you have a spinner component
import type { ReactNode } from "react";
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      try {
        // 1. Check if user has an active session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          throw error || new Error("No active session");
        }

        // 2. Get user role from public.users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("auth_id", session.user.id)
          .single();

        if (userError || !userData) {
          throw userError || new Error("User profile not found");
        }

        // 3. Check if user has the required role
        if (allowedRoles && !allowedRoles.includes(userData.role)) {
          throw new Error("Unauthorized access");
        }

        // If all checks pass
        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("You need to sign in to access this page");
        navigate(ROUTES.SIGN_IN);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1>Loading</h1>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Redirect will happen in the effect
  }

  return <>{children}</>;
}