"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { Badge } from "@/components/ui/badge"
import { type Warehouse } from "@/types/tenant/warehouse"
import { DataTableRowActions } from "./data-table-row-actions"
import { Text, CheckCircle, XCircle } from "lucide-react"

export const columns: ColumnDef<Warehouse>[] = [
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
      placeholder: "Search warehouses...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
    cell: ({ cell }) => (
      <span className="truncate font-medium">{cell.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Code" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="City" />
    ),
    cell: ({ row }) => row.getValue("city") || "—",
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Country" />
    ),
    cell: ({ row }) => (
      <span className="font-mono uppercase">
        {row.getValue("country") || "—"}
      </span>
    ),
  },
  {
    accessorKey: "zones_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Zones" />
    ),
    cell: ({ row }) => row.original.zones_count ?? 0,
  },
  {
    accessorKey: "locations_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Locations" />
    ),
    cell: ({ row }) => row.original.locations_count ?? 0,
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
    accessorKey: "is_primary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Primary" />
    ),
    cell: ({ row }) =>
      row.getValue("is_primary") ? (
        <Badge variant="secondary">Primary</Badge>
      ) : (
        "—"
      ),
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
