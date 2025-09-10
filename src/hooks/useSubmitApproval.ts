import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../libs/supabase.ts";
import { toast } from "sonner";

interface ApprovalData {
  requestId: string;
  isApproved: boolean;
  comments?: string;
}

export function useSubmitApproval() {
  const queryClient = useQueryClient();

  return useMutation({
  mutationFn: async (data: ApprovalData) => {
    //   1. Create an approval record
    const { data: approval, error: approvalError } = await supabase
      .from("approvals")
      .insert({
        request_id: data.requestId,
        is_approved: data.isApproved,
        comments: data.comments,
      })
      .select()
      .single();
    if (approvalError) throw approvalError;

    //   2. Update request stats
    const newStatus = data.isApproved ? "approved" : "rejected";
    const { error: statusError } = await supabase
      .from("requests")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", data.requestId);

    if (statusError) throw statusError;

    return approval;
  },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Decision submitted successfully!");
    },
    onError: (error: { message: any }) => {
      toast.error(`Submission failed: ${error.message}`);
      console.error(`Approval error: ${error}`);
    },
})}
