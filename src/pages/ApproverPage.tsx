import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { databaseService } from '../libs/supabase-service';
import type { ProjectProposalWithDetails, ApproverFilters } from '../libs/types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

const ApproverPage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<ProjectProposalWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ApproverFilters>({});

  const loadProposals = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await databaseService.getProposalsForApproval(filters);
      setProposals(data);
    } catch (error) {
      toast.error('Failed to load proposals');
      console.error('Error loading proposals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
      return;
    }

    if (user && user.role !== 'approver') {
      // Redirect to appropriate page based on role
      if (user.role === 'client') {
        navigate('/client');
      } else if (user.role === 'reviewer') {
        navigate('/reviewer');
      }
      return;
    }

    if (user) {
      loadProposals();
    }
  }, [user, loading, navigate, loadProposals]);

  const handleApprove = async (proposalId: string) => {
    if (!user) return;
    
    try {
      const { error } = await databaseService.approveProposal(proposalId, user.id);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Proposal approved successfully');
        loadProposals();
      }
    } catch {
      toast.error('Failed to approve proposal');
    }
  };

  const handleReject = async (proposalId: string, reason: string) => {
    if (!user) return;
    
    try {
      const { error } = await databaseService.rejectProposal(proposalId, user.id, reason);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Proposal rejected');
        loadProposals();
      }
    } catch {
      toast.error('Failed to reject proposal');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Approver Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant={!filters.status ? "default" : "outline"}
                    onClick={() => setFilters({})}
                  >
                    Needs Approval
                  </Button>
                  <Button
                    variant={filters.decided_by_me ? "default" : "outline"}
                    onClick={() => setFilters({ decided_by_me: true })}
                  >
                    Decided by Me
                  </Button>
                  <Button
                    variant={filters.status === 'approved' ? "default" : "outline"}
                    onClick={() => setFilters({ status: 'approved' })}
                  >
                    Approved
                  </Button>
                  <Button
                    variant={filters.status === 'rejected' ? "default" : "outline"}
                    onClick={() => setFilters({ status: 'rejected' })}
                  >
                    Rejected
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Proposals List */}
            <Card>
              <CardHeader>
                <CardTitle>Proposals for Approval</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading proposals...</div>
                ) : proposals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No proposals found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((proposal) => (
                      <Card key={proposal.id}>
                        <CardHeader>
                          <CardTitle className="flex justify-between">
                            {proposal.title}
                            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(proposal.status)}`}>
                              {formatStatus(proposal.status)}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            Client: {proposal.client.name} | 
                            Reviewer: {proposal.reviewer?.name || 'N/A'} | 
                            Budget: ${proposal.budget.toLocaleString()} | 
                            Start: {new Date(proposal.expected_start_date).toLocaleDateString()} | 
                            End: {new Date(proposal.expected_end_date).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4">{proposal.description}</p>
                          
                          {proposal.status === 'waiting_for_approval' && (
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => {
                                  const reason = prompt('Enter reason for rejection (optional):');
                                  if (reason !== null) { // User didn't cancel
                                    handleReject(proposal.id, reason || 'No specific reason provided');
                                  }
                                }}
                                variant="outline"
                              >
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleApprove(proposal.id)}
                              >
                                Approve
                              </Button>
                            </div>
                          )}
                          
                          {proposal.latest_action && proposal.latest_action.reason && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                              <strong>Decision Reason:</strong> {proposal.latest_action.reason}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper functions
function getStatusColor(status: string): string {
  switch (status) {
    case 'waiting_for_review':
      return 'bg-blue-100 text-blue-800';
    case 'sent_back_to_client':
      return 'bg-yellow-100 text-yellow-800';
    case 'waiting_for_approval':
      return 'bg-purple-100 text-purple-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatStatus(status: string): string {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export default ApproverPage;
