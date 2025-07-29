// User types
export type UserRole = 'client' | 'reviewer' | 'approver';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  created_at: string;
  updated_at: string;
}

// Project proposal types
export type ProjectStatus = 
  | 'draft' 
  | 'waiting_for_review' 
  | 'sent_back_to_client' 
  | 'waiting_for_approval' 
  | 'approved' 
  | 'rejected';

export interface ProjectProposal {
  id: string;
  title: string;
  description: string;
  budget: number;
  expected_start_date: string;
  expected_end_date: string;
  status: ProjectStatus;
  client_id: string;
  reviewer_id?: string;
  approver_id?: string;
  created_at: string;
  updated_at: string;
}

// Action history for tracking proposal changes
export interface ProposalAction {
  id: string;
  proposal_id: string;
  user_id: string;
  action_type: 'submitted' | 'sent_back' | 'forwarded' | 'approved' | 'rejected' | 'edited';
  reason?: string;
  created_at: string;
}

// Extended types with relations
export interface ProjectProposalWithDetails extends ProjectProposal {
  client: Pick<User, 'id' | 'name' | 'email'>;
  reviewer?: Pick<User, 'id' | 'name' | 'email'>;
  approver?: Pick<User, 'id' | 'name' | 'email'>;
  latest_action?: ProposalAction;
}

// Form types
export interface CreateProposalForm {
  title: string;
  description: string;
  budget: number;
  expected_start_date: string;
  expected_end_date: string;
}

export interface SendBackForm {
  reason: string;
}

export interface ApprovalForm {
  action: 'approve' | 'reject';
  reason?: string;
}

// Filter types
export interface ClientFilters {
  status?: 'waiting_for_review' | 'waiting_for_approval' | 'approved' | 'rejected' | 'sent_back_to_client';
}

export interface ReviewerFilters {
  client_id?: string;
  status?: 'waiting_for_review' | 'sent_back_to_client' | 'waiting_for_approval';
  reviewed_by_me?: boolean;
}

export interface ApproverFilters {
  client_id?: string;
  status?: 'waiting_for_approval' | 'approved' | 'rejected';
  decided_by_me?: boolean;
}