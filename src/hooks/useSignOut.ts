import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../libs/supabase.ts";
import { toast } from "sonner";
import { ROUTES } from "../libs/constants.ts";
import { useNavigate } from "react-router-dom";

export const useSignOut = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      //   clear local session so UI updates even it network revoke fails
      await supabase.auth.signOut({ scope: "local" });
      const { error } = await supabase.auth.signOut();
      if (error) {
        const msg = (error as { message?: string }).message ?? "";
        if (!/session/i.test(msg)) throw error;
      }
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success(`Logged out successfully!`);
      navigate(ROUTES.SIGN_IN, { replace: true });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(`Sign out failed: ${message}`);
    },
  });
};
