import { supabase } from './supabase.js';
import { DatabaseService } from './database.js';
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
import { AuthTokenResponsePassword } from '@supabase/supabase-js';

export class SupabaseService implements DatabaseService {
  async signUp(email: string, password: string, name: string, role: UserRole = 'client') {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            name,
            role
          });

        if (profileError) {
          return { user: null, error: profileError.message };
        }

        const user: User = {
          id: data.user.id,
          email,
          name,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        return { user, error: null };
      }

      return { user: null, error: 'Failed to create user' };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (response.error) {
        return { user: null, error: response.error.message };
      }

      if (response.data.user) {
        const user = this.getUserById(response.data.user.id);
        return { user, error: null };
      }

      return { user: null, error: 'Failed to sign in' };
    } catch (error) {
      return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  authToUserModel(authUser: AuthTokenResponsePassword): User | null {
    if (!authUser?.data?.user) return null;

    return {
      id: authUser.data.user.id,
      email: authUser.data.user.email ?? '',
      name: authUser.data.user.user_metadata.name,
      role: authUser.data.user.user_metadata.role,
      created_at: authUser.data.user.created_at,
      updated_at: authUser.data.user.updated_at ?? ''
    };
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      return await this.getUserById(user.id);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) return null;
      return data as User;
    } catch (error) {
      console.error('Error getting user by id:', error);
      return null;
    }
  }

  async updateUserRole(userId: string, role: UserRole) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId);

      return { error: error?.message || null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createProposal(proposal: CreateProposalForm) {
    try {
      const user = await this.getCurrentUser()
      if (!user) {
        throw new Error('User not authenticated');
      }
      const newProposal = {
        ...proposal,
        client_id: user.id,
        status: 'waiting_for_review' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log({newProposal})

      const { data, error } = await supabase
        .from('project_proposals')
        .insert(newProposal)
        .select()
        .single();

      if (error) {
        return { proposal: null, error: error.message };
      }

      // Create action history
      await supabase
        .from('proposal_actions')
        .insert({
          proposal_id: data.id,
          user_id: clientId,
          action_type: 'submitted',
          created_at: new Date().toISOString()
        });

      return { proposal: data as ProjectProposal, error: null };
    } catch (error) {
      return { proposal: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateProposal(proposalId: string, proposal: Partial<CreateProposalForm>) {
    try {
      const { error } = await supabase
        .from('project_proposals')
        .update({
          ...proposal,
          status: 'waiting_for_review',
          updated_at: new Date().toISOString()
        })
        .eq('id', proposalId);

      if (error) {
        return { error: error.message };
      }

      // Create action history
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('proposal_actions')
          .insert({
            proposal_id: proposalId,
            user_id: user.id,
            action_type: 'edited',
            created_at: new Date().toISOString()
          });
      }

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProposal(id: string): Promise<ProjectProposalWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('project_proposals')
        .select(`
          *,
          client:users!client_id(id, name, email),
          reviewer:users!reviewer_id(id, name, email),
          approver:users!approver_id(id, name, email)
        `)
        .eq('id', id)
        .single();

      if (error || !data) return null;

      // Get latest action
      const { data: latestAction } = await supabase
        .from('proposal_actions')
        .select('*')
        .eq('proposal_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        ...data,
        latest_action: latestAction || undefined
      } as ProjectProposalWithDetails;
    } catch (error) {
      console.error('Error getting proposal:', error);
      return null;
    }
  }

  async getClientProposals(clientId: string, filters?: ClientFilters): Promise<ProjectProposalWithDetails[]> {
    try {
      let query = supabase
        .from('project_proposals')
        .select(`
          *,
          client:users!client_id(id, name, email),
          reviewer:users!reviewer_id(id, name, email),
          approver:users!approver_id(id, name, email)
        `)
        .eq('client_id', clientId);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting client proposals:', error);
        return [];
      }

      return data as ProjectProposalWithDetails[];
    } catch (error) {
      console.error('Error getting client proposals:', error);
      return [];
    }
  }

  async getProposalsForReview(filters?: ReviewerFilters): Promise<ProjectProposalWithDetails[]> {
    try {
      let query = supabase
        .from('project_proposals')
        .select(`
          *,
          client:users!client_id(id, name, email),
          reviewer:users!reviewer_id(id, name, email),
          approver:users!approver_id(id, name, email)
        `);

      if (filters?.client_id) {
        query = query.eq('client_id', filters.client_id);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      } else {
        // Default: show proposals that need review
        query = query.eq('status', 'waiting_for_review');
      }

      if (filters?.reviewed_by_me) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('reviewer_id', user.id);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting proposals for review:', error);
        return [];
      }

      return data as ProjectProposalWithDetails[];
    } catch (error) {
      console.error('Error getting proposals for review:', error);
      return [];
    }
  }

  async sendBackToClient(proposalId: string, reviewerId: string, reason: string) {
    try {
      const { error } = await supabase
        .from('project_proposals')
        .update({
          status: 'sent_back_to_client',
          reviewer_id: reviewerId,
          updated_at: new Date().toISOString()
        })
        .eq('id', proposalId);

      if (error) {
        return { error: error.message };
      }

      // Create action history
      await supabase
        .from('proposal_actions')
        .insert({
          proposal_id: proposalId,
          user_id: reviewerId,
          action_type: 'sent_back',
          reason,
          created_at: new Date().toISOString()
        });

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async forwardToApprover(proposalId: string, reviewerId: string) {
    try {
      const { error } = await supabase
        .from('project_proposals')
        .update({
          status: 'waiting_for_approval',
          reviewer_id: reviewerId,
          updated_at: new Date().toISOString()
        })
        .eq('id', proposalId);

      if (error) {
        return { error: error.message };
      }

      // Create action history
      await supabase
        .from('proposal_actions')
        .insert({
          proposal_id: proposalId,
          user_id: reviewerId,
          action_type: 'forwarded',
          created_at: new Date().toISOString()
        });

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProposalsForApproval(filters?: ApproverFilters): Promise<ProjectProposalWithDetails[]> {
    try {
      let query = supabase
        .from('project_proposals')
        .select(`
          *,
          client:users!client_id(id, name, email),
          reviewer:users!reviewer_id(id, name, email),
          approver:users!approver_id(id, name, email)
        `);

      if (filters?.client_id) {
        query = query.eq('client_id', filters.client_id);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      } else {
        // Default: show proposals that need approval
        query = query.eq('status', 'waiting_for_approval');
      }

      if (filters?.decided_by_me) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('approver_id', user.id);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting proposals for approval:', error);
        return [];
      }

      return data as ProjectProposalWithDetails[];
    } catch (error) {
      console.error('Error getting proposals for approval:', error);
      return [];
    }
  }

  async approveProposal(proposalId: string, approverId: string) {
    try {
      const { error } = await supabase
        .from('project_proposals')
        .update({
          status: 'approved',
          approver_id: approverId,
          updated_at: new Date().toISOString()
        })
        .eq('id', proposalId);

      if (error) {
        return { error: error.message };
      }

      // Create action history
      await supabase
        .from('proposal_actions')
        .insert({
          proposal_id: proposalId,
          user_id: approverId,
          action_type: 'approved',
          created_at: new Date().toISOString()
        });

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async rejectProposal(proposalId: string, approverId: string, reason: string) {
    try {
      const { error } = await supabase
        .from('project_proposals')
        .update({
          status: 'rejected',
          approver_id: approverId,
          updated_at: new Date().toISOString()
        })
        .eq('id', proposalId);

      if (error) {
        return { error: error.message };
      }

      // Create action history
      await supabase
        .from('proposal_actions')
        .insert({
          proposal_id: proposalId,
          user_id: approverId,
          action_type: 'rejected',
          reason,
          created_at: new Date().toISOString()
        });

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProposalActions(proposalId: string): Promise<ProposalAction[]> {
    try {
      const { data, error } = await supabase
        .from('proposal_actions')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting proposal actions:', error);
        return [];
      }

      return data as ProposalAction[];
    } catch (error) {
      console.error('Error getting proposal actions:', error);
      return [];
    }
  }
}

// Export singleton instance
export const databaseService = new SupabaseService();
