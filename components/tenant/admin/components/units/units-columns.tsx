"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { type Unit } from "@/types/tenant/unit"
import { DataTableRowActions } from "./data-table-row-actions"
import { Text } from "lucide-react"

const TYPE_OPTIONS = [
  { label: "Weight", value: "weight" },
  { label: "Length", value: "length" },
  { label: "Volume", value: "volume" },
  { label: "Area", value: "area" },
  { label: "Count", value: "count" },
]

export const columns: ColumnDef<Unit>[] = [
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
      placeholder: "Search units...",
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
    accessorKey: "symbol",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Symbol" />
    ),
    cell: ({ row }) => row.getValue("symbol"),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Type" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue("type")}
      </Badge>
    ),
    meta: {
      label: "Type",
      variant: "multiSelect",
      options: TYPE_OPTIONS,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "conversion_factor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Factor" />
    ),
    cell: ({ row }) => row.getValue("conversion_factor"),
  },
  {
    accessorKey: "is_base",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Base" />
    ),
    cell: ({ row }) =>
      row.getValue("is_base") ? (
        <Badge variant="secondary">Base</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "sort_order",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Sort" />
    ),
    cell: ({ row }) => row.getValue("sort_order"),
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
