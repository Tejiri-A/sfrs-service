import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type RequestFormData,
  requestSchema,
  getDepartmentOptions,
} from "../../schemas/request.ts";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx";

import { locations, serviceSchemes } from "../../data.ts";
import { Textarea } from "../ui/textarea.tsx";
import { useSubmitRequest } from "../../hooks/useSubmitRequest.ts";

import { ENTITY_OPTIONS } from "../../libs/constants.ts";
import { v4 as uuidv4 } from "uuid";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.tsx";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar.tsx";
import { cn } from "../../lib/utils.ts";

interface RequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
const RequestModal = ({ open, onOpenChange, onSuccess }: RequestModalProps) => {
  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: "",
      entity: "",
      departmentId: "",
      numberOfPersonnel: 0,
      serviceDescription: "",
      proposedStartDate: new Date(),
      personnelType: "",
      location: "",
      serviceScheme: "",
      comments: "",
    },
  });
  const selectedEntity = form.watch("entity");

  const { mutate: submitRequest, isPending } = useSubmitRequest();

  const onSubmit = (data: RequestFormData) => {
    // console.log("Submitting request: ", data);
    submitRequest(data);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) form.reset();
        onOpenChange(open);
      }}
    >
      <DialogContent className={`sm:max-w-[600px]`}>
        <DialogHeader>
          <DialogTitle>Create New Request</DialogTitle>
          <DialogDescription>
            Fill in the details below to submit a new service request.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4`}>
            {/* Title */}
            <FormField
              control={form.control}
              name={`title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Title</FormLabel>
                  <FormControl>
                    <Input placeholder={`Enter a request title`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div
              className={`grid items-center col-span-2 gap-4 sm:grid-cols-2 sm:gap-6`}
            >
              {/* Entity selection */}
              <FormField
                control={form.control}
                name={`entity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={`w-full`}>
                          <SelectValue placeholder={"Select an entity"} />
                        </SelectTrigger>
                        <SelectContent>
                          {ENTITY_OPTIONS.map(({ value, label }) => (
                            <SelectItem key={uuidv4()} value={value}>
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
              {/*  Department Selection */}
              <FormField
                control={form.control}
                name={`departmentId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedEntity}
                      >
                        <SelectTrigger className={`w-full`}>
                          <SelectValue placeholder={"Select a department"} />
                        </SelectTrigger>
                        <SelectContent>
                          {getDepartmentOptions(selectedEntity).map(
                            ({ value, label }) => (
                              <SelectItem
                                className={`capitalize`}
                                key={uuidv4()}
                                value={value}
                              >
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
            {/* Number of personnel */}
            <FormField
              control={form.control}
              name={`numberOfPersonnel`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number Of Personnel</FormLabel>
                  <FormControl>
                    <Input
                      type={`number`}
                      placeholder={`0`}
                      min={5}
                      max={30}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Service Description */}
            <FormField
              control={form.control}
              name={`serviceDescription`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        "Provide details on the service you are requesting"
                      }
                      className={`resize-none`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*  TODO proposed service start date and personnel type*/}
            <div
              className={`grid items-center col-span-2 gap-4 sm:grid-cols-2 sm:gap-6`}
            >
              {/*  Personnel type */}
              <FormField
                name={`personnelType`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personnel Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={`w-full`}>
                          <SelectValue placeholder={`Personnel Type`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value={`expert`}>Expert</SelectItem>
                            <SelectItem value={`local`}>Local</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*    Proposed service start date*/}
              <FormField
                control={form.control}
                name={"proposedStartDate"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposed Service Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type={`button`}
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Select a date</span>
                            )}
                            <CalendarIcon
                              className={`ml-auto h-4 w-4 opacity-50`}
                            />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className={`w-auto p-0`} align={`start`}>
                        <Calendar
                          mode={`single`}
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            date >
                              new Date(
                                new Date().setFullYear(
                                  new Date().getFullYear() + 1,
                                ),
                              )
                          }
                          autoFocus
                          startMonth={
                            new Date(
                              new Date().getFullYear(),
                              new Date().getMonth(),
                              1,
                            )
                          }
                          endMonth={
                            new Date(
                              new Date().getFullYear() + 1,
                              new Date().getMonth(),
                              1,
                            )
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <div
              className={`grid items-center col-span-2 gap-4 sm:grid-cols-2 sm:gap-6`}
            >
              {/* Location */}
              <FormField
                control={form.control}
                name={`location`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={`w-full`}>
                          <SelectValue placeholder={"Select a location"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {locations.map((location, index) => {
                              const [locationCode, locationName] =
                                location.split(" ");

                              return (
                                <SelectItem key={index} value={locationName}>
                                  {locationCode}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Service Scheme */}
              <FormField
                control={form.control}
                name={`serviceScheme`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Scheme</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={`w-full`}>
                          <SelectValue placeholder={"Select a location"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {serviceSchemes.map((serviceScheme, index) => {
                              return (
                                <SelectItem key={index} value={serviceScheme}>
                                  {serviceScheme}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Other Comments */}
            <FormField
              control={form.control}
              name={`comments`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={"Any other thing you'd like to tell us?"}
                      className={`resize-none`}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className={`flex justify-end gap-2 pt-4`}>
              <Button
                type={`button`}
                variant={`outline`}
                onClick={handleCancel}
              >
                cancel
              </Button>
              <Button type={`submit`} disabled={isPending}>
                {isPending ? "Submitting ..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default RequestModal;
