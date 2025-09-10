import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
// import DetailItem from "../validator/DetailItem.tsx";
import type { Request } from "../../libs/types.ts";
// import { format } from "date-fns";
import { Separator } from "@radix-ui/react-select";
import { Badge } from "../ui/badge.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form.tsx";
import { Textarea } from "../ui/textarea.tsx";
import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitApproval } from "../../hooks/useSubmitApproval.ts";

const approvalSchema = z.object({
  isApproved: z.boolean(),
  comments: z.string().optional(),
});

type ApprovalFormData = z.infer<typeof approvalSchema>;

interface ApproverFormProps {
  request: Request;
  onSuccess: () => void;
  onCancel: () => void;
}

const ApproverForm = ({ request, onSuccess, onCancel }: ApproverFormProps) => {
  const form = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      isApproved: false,
      comments: ""
    }
  })
  const {mutate:submitApproval, isPending} = useSubmitApproval();
  const onSubmit = (data:ApprovalFormData) => {
    submitApproval({
      requestId: request.id,
      ...data,
    },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error) => {
          console.error(`Error submitting approval: ${error.message}`);
        },
      })
  }
  const validation = request.validation;
  return (
    <div className={`space-y-6 max-h-[80vh] overflow-y-auto `}>
      <div className={`flex justify-between items-center`}>
        <h2 className={`text-2xl font-bold`}>Review Request</h2>
        <Button variant={`ghost`} onClick={onCancel} disabled={isPending}>
          Close
        </Button>
      </div>

      <Card>
        <CardHeader className={`pb-3`}>
          <CardTitle className={`text-lg`}>Request Information</CardTitle>
        </CardHeader>
        <CardContent className={`space-y-4`}>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
            <DetailItem label={`Title`} value={request.title} />
            <DetailItem label={`Requester`} value={request.client} />
            <DetailItem
              label={`Department`}
              value={request.department?.name || "N/A"}
            />
            <DetailItem
              label={`Personnel`}
              value={`${request.personnel_count} ${request.personnel_type}`}
            />
            <DetailItem label={`Location`} value={request.location} />
            <DetailItem
              label={`Proposed Start Date`}
              value={request.proposed_start_date}
            />
            <DetailItem
              label={`Service Scheme`}
              value={request.service_scheme}
            />
          </div>
          <Separator />
          <DetailItem
            label={`Service Description`}
            value={request.service_description}
            className={`bg-muted/50 pb-3 rounded-sm`}
          />
          {request.comments && (
            <DetailItem
              label={`Additional Comments`}
              value={request.comments}
              className={`bg-muted/50 p-3 rounded-md`}
            />
          )}
        </CardContent>
      </Card>

      {/*Validation Details*/}
      {validation && (
        <Card>
          <CardHeader className={`pb-3`}>
            <CardTitle className={`text-lg`}>Validation Details</CardTitle>
          </CardHeader>
          <CardContent className={`space-y-4`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
              <DetailItem
                label={`Validated By`}
                value={validation.validator?.email || "N/A"}
              />
              <DetailItem
                label={`Validation Date`}
                value={validation.validated_at}
              />
              <DetailItem
                label={`Cost Center`}
                value={validation.cost_center}
              />
              <DetailItem label={`GL Account`} value={validation.gl_account} />
              <DetailItem
                label={`Budget Owner`}
                value={validation.budget_owner}
              />
              {/*<DetailItem label={`Potential Costs`} value={validation.potential_costs ? `${validation.potential_costs.toLocaleString()}`:`N/A`}/>*/}
            </div>
            <Separator />
            <div>
              <p>Job Impact</p>
              <div className={`flex flex-wrap gap-1`}>
                {validation.job_impact?.map((impact) => (
                  <Badge
                    key={impact}
                    variant={`secondary`}
                    className={`capitalize`}
                  >
                    {impact}
                  </Badge>
                ))}
              </div>
            </div>

            {validation.comments && (
              <DetailItem
                label={`Validator Comments`}
                value={validation.comments}
                className={`bg-muted/50 p-3 rounded-md`}
              />
            )}
            <div className={`flex items-center gap-2`}>
              <span className={`text-sm font-medium`}>Validation Result:</span>
              <Badge
                variant={validation.is_passed ? "secondary" : "destructive"}
              >
                {validation.is_passed ? "Accepted" : "Failed"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
      {/*Approval Form*/}
      <Card>
        <CardHeader className={`pb-3`}>
          <CardTitle className={`text-lg`}>Approval Decision</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4`}>
              <FormField
                control={form.control}
                name={`isApproved`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className={`size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500`}
                      />
                    </FormControl>
                    <FormLabel className={`text-base font-medium`}>
                      Approve this request
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`comments`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decision Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={`Provide reasoning for your decision...`}
                        rows={3}
                        className={`resize-none`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={`flex justify-end gap-3 pt-4`}>
                <Button type={`button`} variant={`outline`} onClick={onCancel} disabled={isPending}>
                  Cancel
                </Button>
                <Button
                  type={`submit`}
                  variant={form.watch("isApproved") ? "default" : "destructive"} disabled={isPending}
                >
                  {form.watch("isApproved")
                    ? `Approve Request`
                    : `Reject Request`}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

function DetailItem({ label, value, className = "" }:{label:string,value:ReactNode,className?:string}) {
  return (
    <div className={className}>
      <dt className={`text-sm font-medium text-muted-foreground mb-1`}>{label}</dt>
      <dd className={`text-sm`}>{value || <span className={`text-muted-foreground`}>Not provided</span>}</dd>
    </div>
  )
}

export default ApproverForm;
