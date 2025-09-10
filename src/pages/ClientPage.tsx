import Navbar from "../components/Navbar.tsx";
import { useState } from "react";
import { Button } from "../components/ui/button.tsx";

import { useRequests } from "../hooks/useRequests.ts";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../components/ui/alert.tsx";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import DataTable from "../components/Client/DataTable.tsx";
import { columns } from "../components/Client/Columns.tsx";
import RequestModal from "../components/Client/RequestModal.tsx";
import useUserDisplayName from "../hooks/useUserDisplayName.ts";

const ClientPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: requests, isLoading, refetch } = useRequests();
  const { data: userName } = useUserDisplayName();

  // Filter for rejected requests to show alert
  const rejectedRequests = requests?.filter(
    (request) => request.status === "validation_rejected",
  );

  return (
    <>
      <Navbar />
      <main
        className={`min-h-screen p-4 md:p-6 min-w-[90vw] max-w-6xl mx-auto mt-0`}
      >
        <div className={`mb-6 flex items-center justify-between`}>
          <div>
            <h1 className={`text-2xl font-bold`}>Welcome, {userName}</h1>
            <p>Create and manage your service requests</p>
            <Button onClick={() => setModalOpen(true)}>Create Request</Button>
          </div>
        </div>
        {/* show any alert if any requests were rejected */}
        {rejectedRequests?.length > 0 && (
          <Alert variant={`destructive`} className={`mb-4`}>
            <ExclamationTriangleIcon className={`h-4 w-4`} />
            <AlertTitle>Attention needed!</AlertTitle>
            <AlertDescription>
              You have {rejectedRequests?.length} requests that were rejected.
              Please review and resubmit if needed.
            </AlertDescription>
          </Alert>
        )}

        <div className={`rounded-md border`}>
          <DataTable columns={columns} data={requests} isLoading={isLoading} />
        </div>
      </main>
      <RequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={refetch}
      />
    </>
  );
};
export default ClientPage;
