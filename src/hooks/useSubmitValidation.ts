import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../libs/supabase.ts";
import { toast } from "sonner";

interface ValidationData {
  requestId: string;
  costCenter: string;
  glAccount: string;
  budgetOwner: string;
  jobImpact: string[];
  isPassed: boolean;
  comments?: string;
}

function useSubmitValidation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ValidationData) => {
    //   Create the validation data
      const {data:validation, error:validationError} = await supabase.from("validations").insert({
        request_id: data.requestId,
        cost_center: data.costCenter,
        gl_account: data.glAccount,
        budget_owner: data.budgetOwner,
        job_impact: data.jobImpact,
        is_passed: data.isPassed,
        comments: data.comments
      }).select().single();
      if (validationError) throw validationError;

    //   Update the request status based on validation result
    //   const {error: requestError} = await supabase.from("requests").update({
    //     status: data.isPassed ? "approval_pending" : "validation_rejected",
    //     updated_at: new Date().toISOString()
    //   }).eq("id", data.requestId)
    //
    //   if(requestError) throw requestError;

      return validation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-validations"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Validation submitted successfully!");
    },
    onError: (error) => {
      toast.error(`Submission failed: ${error.message}`);
    },
  })
}

export default useSubmitValidation;
