"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { type Tenant, TenantStatus } from "@/types/central/tenant"
import { DataTableRowActions } from "./data-table-row-actions"
import { Text, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

const statusVariantMap: Record<TenantStatus, React.ComponentProps<typeof Status>["variant"]> = {
  active: "success",
  pending: "warning",
  suspended: "error",
}

const statusIconMap: Record<TenantStatus, React.ElementType> = {
  active: CheckCircle2,
  pending: Clock,
  suspended: AlertTriangle,
}

export const columns: ColumnDef<Tenant>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          (table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")) as boolean
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 32,
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    meta: {
      label: "Name",
      placeholder: "Search tenants...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
    cell: ({ cell }) => (
      <span className="truncate font-medium">{cell.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Slug" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("slug")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Email" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("email") || "—"}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Phone" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("phone") || "—"}</span>
    ),
  },
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Plan" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("plan") || "—"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as TenantStatus
      const StatusIcon = statusIconMap[status]
      return (
        <Status variant={statusVariantMap[status]}>
          <StatusIndicator />
          <StatusLabel className="capitalize">{status}</StatusLabel>
        </Status>
      )
    },
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [
        { label: "Active", value: "active", icon: CheckCircle2 },
        { label: "Pending", value: "pending", icon: Clock },
        { label: "Suspended", value: "suspended", icon: AlertTriangle },
      ],
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "trial_ends_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Trial Ends" />
    ),
    cell: ({ row }) => {
      const trialEnds = row.getValue("trial_ends_at")
      return (
        <span className="text-muted-foreground">
          {trialEnds ? new Date(trialEnds as string).toLocaleDateString() : "—"}
        </span>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ row }) =>
      new Date(row.getValue("created_at")).toLocaleDateString(),
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <DataTableRowActions row={row} />,
    size: 32,
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
]
