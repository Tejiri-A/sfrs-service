import { glAccountOptions } from "../libs/constants.ts";
import { z } from "zod";
export function getGlAccountOptions(
  costCenter: string,
): Array<{ value: string; label: string }> {
 if(!costCenter || !(costCenter in glAccountOptions)) return [];
 return glAccountOptions[costCenter as keyof typeof glAccountOptions];
}

export const validationSchema = z.object({
  costCenter: z.string().trim().min(1, "Required"),
  glAccount: z.string().trim().min(1, "Required"),
  budgetOwner: z.string().trim().min(2, "Requires at least 2 characters").optional(),
  jobImpact: z
    .array(z.string())
    .min(1, { message: "Select at least one job impact" }),

  isPassed: z.boolean().default(false),
  comments: z.string().trim().optional(),
});

export type ValidationFormData = {
  costCenter: string;
  glAccount: string;
  budgetOwner: string;
  jobImpact: string[];
  isPassed: boolean;
  comments?: string;
}