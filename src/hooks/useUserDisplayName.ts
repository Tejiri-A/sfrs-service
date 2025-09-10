import { supabase } from "../libs/supabase.ts";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

async function fetchUserDisplayName() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return (
      user?.user_metadata?.fullName ?? user?.email ?? user?.id ?? "Anonymous"
    );
  } catch (e: any) {
    toast.error(e.message);
  }
}

export default function useUserDisplayName() {
  return useQuery({
    queryKey: ["userDisplayName"],
    queryFn: fetchUserDisplayName,
  });
}