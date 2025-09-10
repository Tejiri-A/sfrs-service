// src/hooks/useRequests.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../libs/supabase.ts";
import type { Request } from "../libs/types.ts";

export function useRequests() {
  return useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Request[];
    },
    refetchOnWindowFocus: false, // Optional: prevents refetch when window regains focus
  });
}