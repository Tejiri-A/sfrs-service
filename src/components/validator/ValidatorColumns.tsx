// src/pages/validator/components/validator-columns.tsx
import { type ColumnDef } from "@tanstack/react-table";
import { type Request } from "../../libs/types.ts";
import { format } from "date-fns";
import { Badge } from '../ui/badge.tsx';

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "title",
    header: "Request Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "client_email",
    header: "Requested By",
    cell: ({ row }) => (
      <a
        href={`mailto:${row.getValue("client_email")}`}
        className="text-blue-600 hover:underline"
      >
        {row.getValue("client_email")}
      </a>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date Submitted",
    cell: ({ row }) => format(new Date(row.getValue("created_at")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.getValue("status").replace("_", " ")}
      </Badge>
    ),
  },
];