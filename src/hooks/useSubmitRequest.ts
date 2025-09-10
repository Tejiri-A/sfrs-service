import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type RequestFormData } from "../schemas/request.ts";
import { supabase } from "../libs/supabase.ts";
import { toast } from "sonner";
// import { useAuth } from "./useAuth.ts";

export const useSubmitRequest = () => {
  const queryClient = useQueryClient();
  // const { user } = useAuth();

  return useMutation({
    mutationFn: async (formData: RequestFormData) => {
      const requestData = {
        // client_id: user?.id,
        title: formData.title,
        entity: formData.entity,
        department_id: formData.departmentId,
        personnel_count: formData.numberOfPersonnel,
        service_description: formData.serviceDescription,
        proposed_start_date: formData.proposedStartDate.toISOString(),
        personnel_type: formData.personnelType,
        location: formData.location,
        service_scheme: formData.serviceScheme,
        comments: formData.comments,
        status: "validation_pending",
      };

      const { data, error } = await supabase
        .from("requests")
        .insert(requestData)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request submitted successfully!");
      // form.reset();
      // onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Submission failed: ${error.message}`);
    },
  });
};
