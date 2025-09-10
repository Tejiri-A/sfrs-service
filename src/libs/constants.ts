// src/lib/constants.ts
import { v4 as uuid } from "uuid";
export const ROUTES = {
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  CLIENT_DASHBOARD: "/client",
  VALIDATOR_DASHBOARD: "/validator",
  APPROVER_DASHBOARD: "/approver",
};

export const ENTITY_OPTIONS = [
  { value: "sciences", label: "Sciences" },
  { value: "engineering", label: "Engineering" },
  { value: "medicalAndHealthSciences", label: "Medical and Health Sciences" },
  { value: "socialManagementSciences", label: "Social Management Sciences" },
  { value: "arts", label: "Arts" },
];

export const DEPARTMENT_OPTIONS = {
  sciences: [
    { value: "physics", label: "Physics" },
    { value: "computer-science", label: "Computer Science" },
    { value: "chemistry", label: "Chemistry" },
    { value: "Soil-Science", label: "Soil Science" },
    { value: "Bio-Science", label: "Bio Science" },
  ],
  engineering: [
    { value: "mechanical", label: "Mechanical" },
    { value: "electrical-and-electronic", label: "Electrical and Electronic" },
    { value: "software", label: "Software" },
    { value: "civil", label: "Civil" },
  ],
  medicalAndHealthSciences: [
    { value: "medicine", label: "Medicine" },
    { value: "dentistry", label: "Dentistry" },
    { value: "pharmacy", label: "Pharmacy" },
    { value: "surgery", label: "Surgery" },
  ],
  socialManagementSciences: [
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "sports", label: "Sports" },
    { value: "mass-communication", label: "Mass Communication" },
    { value: "financial-accounting", label: "Financial Accounting" },
  ],
  arts: [
    { value: "government", label: "Government" },
    { value: "literature", label: "Literature" },
  ],
};

export const costCenterOptions = [
  { value: "CONS007", label: "CONS 007" },
  { value: "DONS711", label: "DONS 711" },
  { value: "ABJ701", label: "ABJ 701" },
];

export const glAccountOptions = {
  CONS007: [
    {value:'0071001', label:'0071001'},
    {value:'0071002', label:'0071002'},
    {value:'0071003', label:'0071003'},
  ],
  DONS711: [
    {value:'711004', label:'711004'},
    {value:'711007', label:'711007'},
    {value:'711009', label:'711009'},
  ],
  ABJ701: [
    {value:'801001', label:'801001'},
    {value:'801002', label:'801002'},
    {value:'801003', label:'801003'},
  ],

}

export const jobImpacts = [
  {id: uuid(), value: 'high impact', label: 'High impact'},
  {id: uuid(), value: 'strategic importance', label: 'Strategic importance'},
  {id: uuid(), value: 'high consequences of failure', label: 'High consequences of failure'},
  {id: uuid(), value: 'sensitivity', label: 'Sensitivity'},
  {id: uuid(), value: 'business continuity', label: 'Business continuity'},
  {id: uuid(), value: 'high visibility', label: 'High visibility'},
  {id: uuid(), value: 'specialized skills', label: 'Specialized skills'},
]