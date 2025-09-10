// src/lib/types.ts

// User types
export type UserRole = 'client' | 'validator' | 'approver';

export interface User {
  id: string;
  auth_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Request status types
export type RequestStatus =
  | 'draft'
  | 'submitted'
  | 'validation_pending'
  | 'validation_rejected'
  | 'approval_pending'
  | 'approved'
  | 'rejected';

// Department types
export interface Department {
  id: string;
  name: string;
  entity: string;
}

// Request types
export interface Request {
  id: string;
  client_id: string;
  title: string;
  entity: string;
  department_id: string | null;
  department?: Department;
  personnel_count: number;
  service_description: string;
  proposed_start_date: string;
  personnel_type: string;
  location: string;
  service_scheme: string;
  comments: string | null;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  client?: User; // Expanded client info
  validation?: Validation & {validator?: User}
}

// Validation types
export interface Validation {
  id: string;
  request_id: string;
  validator_id: string | null;
  validator?: User;
  cost_center: string;
  gl_account: string;
  budget_owner: string;
  job_impact: string[];
  impact_description: string | null;
  potential_costs: number | null;
  is_passed: boolean;
  comments: string | null;
  validated_at: string;
}

// Approval types
export interface Approval {
  id: string;
  request_id: string;
  approver_id: string | null;
  approver?: User;
  is_approved: boolean;
  comments: string | null;
  approved_at: string;
}

// Status history types
export interface StatusHistory {
  id: string;
  request_id: string;
  changed_by: string | null;
  changed_by_user?: User;
  from_status: RequestStatus | null;
  to_status: RequestStatus;
  changed_at: string;
}

// Form data types (for client request form)
export interface RequestFormValues {
  title: string;
  entity: string;
  departmentId: string;
  personnelCount: number;
  serviceDescription: string;
  proposedStartDate: Date;
  personnelType: string;
  location: string;
  serviceScheme: string;
  comments?: string;
}

// Dropdown option types
export interface SelectOption {
  value: string;
  label: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  error: string | null;
}

// Table column type for TanStack Table
export type RequestTableColumn = {
  id: string;
  title: string;
  status: RequestStatus;
  created_at: string;
  proposed_start_date: string;
  department?: {
    name: string;
  };
};

// Pagination types
export interface Pagination {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

// Filter types
export interface RequestFilter {
  status?: RequestStatus;
  entity?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}