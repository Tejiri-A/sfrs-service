// src/schemas/requests.ts
import { z } from "zod";

// Define department and entity options
export const ENTITY_OPTIONS = [
  "sciences",
  "engineering",
  "medical and health sciences",
  "social management sciences",
  "arts",
] as const;
export const DEPARTMENT_OPTIONS = {
  sciences: [
    "physics",
    "computer science",
    "chemistry",
    "Soil Science",
    "Bio Science",
  ],
  engineering: ["mechanical", "electrical and electronic", "software", "civil"],
  medicalAndHealthSciences: ["medicine", "dentistry", "pharmacy", "surgery"],
  socialManagementSciences: [
    "cybersecurity",
    "sports",
    "mass communication",
    "financial accounting",
  ],
  arts: ["government", "literature"],
} as const;
export const PERSONNEL_TYPES = ["expert", "local"] as const;
export const LOCATIONS = ["LOS", "ABJ", "PHC", "OFF"] as const;
export const SERVICE_SCHEMES = ["rotational", "resident"] as const;

// Base schema for request validation
export const requestSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  // entity: z.enum(ENTITY_OPTIONS, {
  //   required_error: "Please select an entity",
  // }),
  entity: z.string().min(1, "Please select an entity"),

  departmentId: z.string().min(1, "Please select a department"),

  numberOfPersonnel: z
    .number()
    .int("Must be a whole number")
    .positive("Must be at least 5")
    .max(100, "Cannot exceed 100 personnel"),

  serviceDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  proposedStartDate: z
    .date({
      required_error: "Please select a start date",
    })
    .min(new Date(), "Start date must be in the future"),

  personnelType: z.string().min(1, "Please select a personnel type"),

  location: z.string().min(1, "Please select a location"),

  serviceScheme: z.string().min(1, "Please select a service scheme"),

  comments: z
    .string()
    .max(500, "Comments cannot exceed 500 characters")
    .optional(),
});

// Infer the TypeScript type from the Zod schema
export type RequestFormData = z.infer<typeof requestSchema>;

// Type for department options (used in form)
export type DepartmentOption = {
  value: string;
  label: string;
  entity: string;
};

export function getDepartmentOptions(entity: string): Array<{value: string, label: string}> {
  if (!entity || !(entity in DEPARTMENT_OPTIONS)) return [];

  return DEPARTMENT_OPTIONS[entity as keyof typeof DEPARTMENT_OPTIONS].map(dept => ({
    value: dept.toLowerCase().replace(/\s+/g, '-'),
    label: dept
  }));
}

// Type for the API response (created request)
export type ApiRequest = {
  id: string;
  title: string;
  entity: string;
  department_id: string;
  personnel_count: number;
  service_description: string;
  proposed_start_date: string;
  personnel_type: string;
  location: string;
  service_scheme: string;
  comments: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};
