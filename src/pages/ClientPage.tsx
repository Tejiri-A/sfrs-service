import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { databaseService } from '../libs/supabase-service';
import type { ProjectProposalWithDetails, ClientFilters } from '../libs/types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import CreateProposalForm from '../components/proposals/CreateProposalForm';

const ClientPage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<ProjectProposalWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState<ClientFilters>({});

  const loadProposals = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await databaseService.getClientProposals(user.id, filters);
      setProposals(data);
    } catch (error) {
      toast.error('Failed to load proposals');
      console.error('Error loading proposals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
      return;
    }

    if (user && user.role !== 'client') {
      // Redirect to appropriate page based on role
      if (user.role === 'reviewer') {
        navigate('/reviewer');
      } else if (user.role === 'approver') {
        navigate('/approver');
      }
      return;
    }

    if (user) {
      loadProposals();
    }
  }, [user, loading, navigate, loadProposals]);

  const handleProposalCreated = () => {
    setShowCreateForm(false);
    loadProposals();
    toast.success('Proposal created successfully!');
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
            <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
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
          {showCreateForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New Proposal</CardTitle>
                <CardDescription>
                  Fill out the form below to submit a new project proposal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateProposalForm
                  onSuccess={handleProposalCreated}
                  onCancel={() => setShowCreateForm(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Actions */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Proposals</h2>
                <Button onClick={() => setShowCreateForm(true)}>
                  Create New Proposal
                </Button>
              </div>

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
                      All
                    </Button>
                    <Button
                      variant={filters.status === 'waiting_for_review' ? "default" : "outline"}
                      onClick={() => setFilters({ status: 'waiting_for_review' })}
                    >
                      Waiting for Review
                    </Button>
                    <Button
                      variant={filters.status === 'sent_back_to_client' ? "default" : "outline"}
                      onClick={() => setFilters({ status: 'sent_back_to_client' })}
                    >
                      Sent Back to Me
                    </Button>
                    <Button
                      variant={filters.status === 'waiting_for_approval' ? "default" : "outline"}
                      onClick={() => setFilters({ status: 'waiting_for_approval' })}
                    >
                      Waiting for Approval
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
                  <CardTitle>Proposals</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">Loading proposals...</div>
                  ) : proposals.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No proposals found</p>
                      <Button onClick={() => setShowCreateForm(true)} className="mt-4">
                        Create Your First Proposal
                      </Button>
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
                              Budget: ${proposal.budget.toLocaleString()} | 
                              Start: {new Date(proposal.expected_start_date).toLocaleDateString()} | 
                              End: {new Date(proposal.expected_end_date).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{proposal.description}</p>
                            {proposal.latest_action && proposal.latest_action.reason && (
                              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <strong>Latest Feedback:</strong> {proposal.latest_action.reason}
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
          )}
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

export default ClientPage;
