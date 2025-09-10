import Navbar from "../components/Navbar.tsx";
import useUserDisplayName from "../hooks/useUserDisplayName.ts";
import { usePendingValidations } from "../hooks/usePendingValidations.ts";
import { useState } from "react";
import type { Request } from "../libs/types.ts";
import DataTable from "../components/Client/DataTable.tsx";
import { columns } from "../components/validator/ValidatorColumns.tsx";
import ValidatorForm from "../components/validator/ValidatorModal.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog.tsx";
import ValidatorModal from "../components/validator/ValidatorModal.tsx";

const ValidatorPage = () => {
  const { data: displayName } = useUserDisplayName();
  const { data: requests, isLoading, refetch } = usePendingValidations();
  const [selectedRequest, setSelectedRequest] = useState<Request, null>(null);
  const onOpenChange = (open) => {
    !open && setSelectedRequest(null);
  }
  return (
    <>
      <Navbar />
      <main
        className={`min-h-screen p-4 md:p-6 min-w-[90vw] max-w-6xl mx-auto mt-0`}
      >
        <div>
          <h1 className={`text-2xl font-bold`}>Welcome, {displayName}</h1>
          <p>Validate existing user requests</p>
        </div>

        <div className={`flex flex-col gap-4 mt-4`}>
          <DataTable
            columns={columns}
            data={requests || []}
            isLoading={isLoading}
            onRowClick={(request) => setSelectedRequest(request)}
          />

          {/*Modal Dialog*/}
          {/*<Dialog*/}
          {/*  open={!!selectedRequest}*/}
          {/*  onOpenChange={(open) => !open && setSelectedRequest(null)}*/}
          {/*>*/}
          {/*  <DialogContent className={`w-6xl max-h-[90vh] overflow-y-auto `} >*/}
          {/*    <DialogHeader>*/}
          {/*      <DialogTitle>Validate Request</DialogTitle>*/}
          {/*    </DialogHeader>*/}
          {/*    {selectedRequest && (*/}
          {/*      <ValidatorForm*/}
          {/*        request={selectedRequest}*/}
          {/*        onSuccess={() => {*/}
          {/*          setSelectedRequest(null);*/}
          {/*          refetch();*/}
          {/*        }}*/}
          {/*        onCancel={() => setSelectedRequest(null)}*/}
          {/*      />*/}
          {/*    )}*/}
          {/*  </DialogContent>*/}
          {/*</Dialog>*/}
          <ValidatorModal
            open={!!selectedRequest}
            request={selectedRequest}
            onCancel={() => setSelectedRequest(null)}
            onSuccess={() => setSelectedRequest(null)}
            onOpenChange={onOpenChange}
          />
        </div>
      </main>
    </>
  );
};
export default ValidatorPage;
