import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Request } from "../../libs/types.ts";
import useSubmitValidation from "../../hooks/useSubmitValidation.ts";
import { toast } from "sonner";
// import { Card, CardContent, CardHeader } from "../ui/card.tsx";
import DetailItem from "./DetailItem.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx";
import { costCenterOptions, jobImpacts } from "../../libs/constants.ts";
import { v4 as uuid } from "uuid";
import { getGlAccountOptions } from "../../schemas/validator.ts";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { Checkbox } from "../ui/checkbox.tsx";
import { Textarea } from "../ui/textarea.tsx";
import type { ValidationFormData } from "../../schemas/validator.ts";
import { validationSchema } from "../../schemas/validator.ts";

interface ValidatorModalProps {
  request: Request;
  onSuccess: () => void;
  onCancel: () => void;
  open: boolean;
  onOpenChange: () => void;
}

const ValidatorModal = ({
  request,
  onSuccess,
  open,
  onOpenChange,
}: ValidatorModalProps) => {
  const form = useForm<ValidationFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      costCenter: "",
      glAccount: "",
      budgetOwner: "",
      jobImpact: [],
      isPassed: false,
      comments: "",
    },
  });
  const { mutate: submitValidation, isPending } = useSubmitValidation();

  const onSubmit = (data: ValidationFormData) => {
    console.log(`Submitting: ${data}`);
    submitValidation(
      {
        requestId: request.id,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Validation submitted successfully!");
          onSuccess();
        },
        onError: (error) => {
          toast.error(`Submission failed: ${error.message}`);
        },
      },
    );
  };
  const selectedCostCenter = form.watch("costCenter");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
        </DialogHeader>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
          <div className="space-y-4">
            <DetailItem label={`Request Title`} value={request?.title} />
            <DetailItem label={`Submission Date`} value={request?.created_at} />
            <DetailItem label={`Entity`} value={request?.entity} />
            <DetailItem label={`Department`} value={String(request?.department)} />
          </div>
          <div className="space-y-4">
            <DetailItem
              label={`Personnel Type`}
              value={request?.personnel_type}
            />
            <DetailItem
              label={`Number Of Personnel`}
              value={request?.personnel_count}
            />
            <DetailItem label={`Location`} value={request?.location} />
            <DetailItem
              label={`Service Scheme`}
              value={request?.service_scheme}
            />
          </div>
        </div>
        <div className={`mt-6 space-y-4`}>
          <DetailItem
            label={`Service Description`}
            value={request?.service_description}
          />
          {request?.comments && (
            <DetailItem
              label={`Additional Comments`}
              value={request?.comments}
            />
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4`}>
            <div className={`grid grid-cols-2 gap-2`}>
              <FormField
                name={`costCenter`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Center</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={`w-full`}>
                          <SelectValue placeholder={`Select a cost center`} />
                        </SelectTrigger>
                        <SelectContent>
                          {costCenterOptions.map(({ value, label }) => (
                            <SelectItem key={uuid()} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`glAccount`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GL Account</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedCostCenter}
                      >
                        <SelectTrigger className={`w-full`}>
                          <SelectValue placeholder={`Select a GL Account`} />
                        </SelectTrigger>
                        <SelectContent>
                          {getGlAccountOptions(selectedCostCenter).map(
                            ({ value, label }) => (
                              <SelectItem key={uuid()} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name={`budgetOwner`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Owner</FormLabel>
                  <FormControl>
                    <Input placeholder={`Budget owner`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`jobImpact`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Impact</FormLabel>
                  <div className={`grid md:grid-cols-2 gap-2`}>
                    {jobImpacts.map(({ id, label, value }) => (
                      <FormField
                        key={id}
                        name={`jobImpact`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem
                            key={id}
                            className={`flex flex-row items-center gap-2`}
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(value)}
                                onCheckedChange={(checked) =>
                                  checked
                                    ? field.onChange([...field.value, value])
                                    : field.onChange(
                                        field.value?.filter(
                                          (item) => item !== value,
                                        ),
                                      )
                                }
                              />
                            </FormControl>
                            <FormLabel>{label}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name={`comments`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Additional comments...`}
                      {...field}
                      className={`resize-none`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`isPassed`}
              control={form.control}
              render={({ field }) => (
                <FormItem className={`flex items-center gap-2`}>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className={`capitalize text-lg`}>
                    Validation passed?
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type={`submit`} disabled={isPending}>
              {isPending ? `Submitting` : `Submit`}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default ValidatorModal;
