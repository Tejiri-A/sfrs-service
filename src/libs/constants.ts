// src/lib/constants.ts
export const ROUTES = {
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  CLIENT_DASHBOARD: "/client",
  VALIDATOR_DASHBOARD: "/validator",
  APPROVER_DASHBOARD: "/approver",
};

export const ENTITY_OPTIONS = [
  { value: "corporate", label: "Corporate" },
  { value: "manufacturing", label: "Manufacturing" },
  // Add more entities as needed
];

export const DEPARTMENT_OPTIONS = {
  corporate: [
    { value: "hr", label: "HR" },
    { value: "finance", label: "Finance" },
    { value: "it", label: "IT" },
  ],
  manufacturing: [
    { value: "production", label: "Production" },
    { value: "quality", label: "Quality" },
  ],
};