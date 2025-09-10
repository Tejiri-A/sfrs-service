import { useQuery } from "@tanstack/react-query";
import { supabase } from "../libs/supabase.ts";

export function usePendingValidations() {
  return useQuery({
    queryKey: ["pendingValidations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("status", "validation_pending")
        .order("created_at", { ascending: true });
      if (error) {
        throw new Error(error.message);
      }
      // return data as Request[];
      return data;
    },
  });
}
