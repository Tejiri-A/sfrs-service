// src/components/DataTable/columns.ts
// src/components/DataTable/columns.ts
import type { ColumnDef } from "@tanstack/react-table";
import type { Request } from "../../libs/types.ts";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Button } from "../ui/button.tsx";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "entity",
    header: "Entity",
    cell: ({ row }) => row.getValue("entity"),
  },

  {
    accessorKey: "department_id",
    header: "Department",
    cell: ({ row }) => row.getValue("department_id") || "N/A",
  },
  {
    accessorKey: "personnel_count",
    header: "Number of Personnel",
    cell: ({ row }) => row.getValue("personnel_count") || "N/A",
  },
  {
    accessorKey: "service_description",
    header: "Service Description",
    cell: ({ row }) => row.getValue("service_description") || "N/A",
  },
  {
    accessorKey: "proposed_start_date",
    header: "Proposed start date",
    cell: ({ row }) => row.getValue("proposed_start_date") || "N/A",
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => format(new Date(row.getValue("created_at")), "PPp"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const variantMap = {
        draft: "secondary",
        submitted: "default",
        validation_pending: "default",
        validation_rejected: "destructive",
        approval_pending: "default",
        approved: "success",
        rejected: "destructive",
      };

      return (
        <Badge variant={variantMap[status as keyof typeof variantMap]}>
          {String(status).replace("_", " ")}
        </Badge>
      );
    },
  },
];
