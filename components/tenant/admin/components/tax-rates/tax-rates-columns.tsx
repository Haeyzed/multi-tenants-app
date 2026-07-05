"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { Badge } from "@/components/ui/badge"
import { type TaxRate } from "@/types/tenant/tax-rate"
import { DataTableRowActions } from "./data-table-row-actions"
import { Text, CheckCircle, XCircle } from "lucide-react"

export const columns: ColumnDef<TaxRate>[] = [
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
      placeholder: "Search tax rates...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
    cell: ({ cell }) => (
      <span className="truncate font-medium">{cell.getValue<string>()}</span>
    ),
  },
  {
    id: "tax_class",
    accessorFn: (row) => row.tax_class?.name ?? "—",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Tax Class" />
    ),
    cell: ({ row }) => (
      <span className="truncate text-muted-foreground">
        {row.original.tax_class?.name ?? "—"}
      </span>
    ),
  },
  {
    id: "tax_zone",
    accessorFn: (row) => row.tax_zone?.name ?? "—",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Tax Zone" />
    ),
    cell: ({ row }) => (
      <span className="truncate text-muted-foreground">
        {row.original.tax_zone?.name ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "rate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Rate" />
    ),
    cell: ({ row }) => `${row.getValue("rate")}%`,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Priority" />
    ),
    cell: ({ row }) => row.getValue("priority"),
  },
  {
    accessorKey: "is_compound",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Compound" />
    ),
    cell: ({ row }) =>
      row.getValue("is_compound") ? (
        <Badge variant="secondary">Yes</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("is_active")
      return (
        <Status variant={isActive ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>{isActive ? "Active" : "Inactive"}</StatusLabel>
        </Status>
      )
    },
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [
        { label: "Active", value: "active", icon: CheckCircle },
        { label: "Inactive", value: "inactive", icon: XCircle },
      ],
    },
    enableColumnFilter: true,
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
