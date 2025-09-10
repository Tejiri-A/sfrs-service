import { useQuery } from "@tanstack/react-query";
import { supabase } from "../libs/supabase.ts";
import type { Request } from "../libs/types.ts";

// src/hooks/usePendingApprovals.ts
export function usePendingApprovals() {
  return useQuery({
    queryKey: ["pending-approvals"],
    queryFn: async (): Promise<Request[]> => {
      console.log("Fetching pending approvals...");

      const { data, error } = await supabase
        .from("requests")
        .select(`
          *,
          
          validations(
            *,
            validator:users(*)
          )
        `)
        .eq("status", "approval_pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Raw data from Supabase:", data);

      // Transform the data
      const transformedData = data?.map(request => {
        const validation = request.validations?.[0] || null;
        console.log(`Request ${request.id} validation:`, validation);
        return {
          ...request,
          validation
        };
      }) || [];

      console.log("Transformed data:", transformedData);
      return transformedData;
    },
  });
}