import { 
  User, 
  UserRole, 
  ProjectProposal, 
  ProjectProposalWithDetails, 
  ProposalAction, 
  CreateProposalForm,
  ClientFilters,
  ReviewerFilters,
  ApproverFilters
} from './types.js';

// Abstract database interface
export interface DatabaseService {
  // Auth methods
  signUp(email: string, password: string, name: string, role?: UserRole): Promise<{ user: User | null; error: string | null }>;
  signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }>;
  signOut(): Promise<{ error: string | null }>;
  getCurrentUser(): Promise<User | null>;
  
  // User methods
  getUserById(id: string): Promise<User | null>;
  updateUserRole(userId: string, role: UserRole): Promise<{ error: string | null }>;
  
  // Project proposal methods
  createProposal(proposal: CreateProposalForm, clientId: string): Promise<{ proposal: ProjectProposal | null; error: string | null }>;
  updateProposal(proposalId: string, proposal: Partial<CreateProposalForm>): Promise<{ error: string | null }>;
  getProposal(id: string): Promise<ProjectProposalWithDetails | null>;
  
  // Client methods
  getClientProposals(clientId: string, filters?: ClientFilters): Promise<ProjectProposalWithDetails[]>;
  
  // Reviewer methods
  getProposalsForReview(filters?: ReviewerFilters): Promise<ProjectProposalWithDetails[]>;
  sendBackToClient(proposalId: string, reviewerId: string, reason: string): Promise<{ error: string | null }>;
  forwardToApprover(proposalId: string, reviewerId: string): Promise<{ error: string | null }>;
  
  // Approver methods
  getProposalsForApproval(filters?: ApproverFilters): Promise<ProjectProposalWithDetails[]>;
  approveProposal(proposalId: string, approverId: string): Promise<{ error: string | null }>;
  rejectProposal(proposalId: string, approverId: string, reason: string): Promise<{ error: string | null }>;
  
  // Action history
  getProposalActions(proposalId: string): Promise<ProposalAction[]>;
}
