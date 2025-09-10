import Navbar from "../components/Navbar.tsx";
import { usePendingApprovals } from "../hooks/usePendingApprovals.ts";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { RefreshCw } from "lucide-react";
import DataTable from "../components/Client/DataTable.tsx";
import { columns } from "../components/approver/ApproverColumns.tsx";
import { Dialog, DialogContent } from "../components/ui/dialog.tsx";
import ApproverForm from "../components/approver/ApproverForm.tsx";

const ApproverPage = () => {
  const { data: requests, isLoading, error, refetch } = usePendingApprovals();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  if (error) {
    return (
      <div className={`container mx-auto py-4`}>
        <Card className={`border-destructive`}>
          <CardHeader>
            <CardTitle className={`text-destructive`}>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load pending approvals: {error.message}</p>
            <Button
              className={`mt-4`}
              type={`button`}
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <main className={`container mx-auto py-4 space-y-4 overflow-y-auto`}>
        <div className={`flex justify-between items-center`}>
          <div>
            <h1 className={`text-2xl font-bold`}>Requests Pending Approval</h1>
            <p className={`text-muted-foreground`}>
              Review and approve/reject validated requests
            </p>
          </div>
          <Button
            variant={`outline`}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`size-4 mr-2 ${isLoading ? `animate-spin` : ``}`}
            />
            Refresh
          </Button>
        </div>
        <Card>
          <CardContent className={`p-0`}>
            <DataTable
              columns={columns}
              data={requests || []}
              isLoading={isLoading}
              onRowClick={setSelectedRequest}
            />
          </CardContent>
        </Card>
        <Dialog
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        >
          <DialogContent className={`w-screen max-w-6xl mx-auto `}>
            {selectedRequest && <ApproverForm request={selectedRequest} onSuccess={() => {
              setSelectedRequest(null);
              refetch()
            }} onCancel={() => setSelectedRequest(null)}/>}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};
export default ApproverPage;
