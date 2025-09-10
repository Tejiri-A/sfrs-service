import type { ColumnDef } from "@tanstack/react-table";
import type { Request } from "../../libs/types.ts";
import { format } from "date-fns";
import { Badge } from "../ui/badge.tsx";

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "title",
    header: "Request Title",
    cell: ({ row }) => (
      <div className="font-medium max-w-xs truncate">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "client_email",
    header: "Requester",
    cell: ({ row }) => (
      <div className="max-w-xs truncate">
        <a
          href={`mailto:${row.getValue("client_email")}`}
          className="text-blue-600 hover:underline text-sm"
        >
          {row.getValue("client_email")}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "validation.cost_center",
    header: "Cost Center",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.validation?.cost_center || "N/A"}
      </span>
    ),
  },

  {
    accessorKey: "created_at",
    header: "Submitted",
    cell: ({ row }) => (
      <span className="text-sm">
        {format(new Date(row.getValue("created_at")), "MMM dd")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue("status").replace(/_/g, " ")}
      </Badge>
    ),
  },
];