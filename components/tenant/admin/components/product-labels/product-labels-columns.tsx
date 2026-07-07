"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { type ProductLabel } from "@/types/tenant/product-label"
import { DataTableRowActions } from "./data-table-row-actions"
import { Text, Eye, EyeOff } from "lucide-react"

function ColorCell({ color }: { color: string | null }) {
  if (!color) {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block size-4 shrink-0 rounded border"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="font-mono text-xs text-muted-foreground">{color}</span>
    </div>
  )
}

export const columns: ColumnDef<ProductLabel>[] = [
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
      placeholder: "Search labels...",
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
    accessorKey: "color",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Color" />
    ),
    cell: ({ row }) => (
      <ColorCell color={row.getValue("color") as string | null} />
    ),
  },
  {
    accessorKey: "background_color",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Background" />
    ),
    cell: ({ row }) => (
      <ColorCell color={row.getValue("background_color") as string | null} />
    ),
  },
  {
    accessorKey: "icon",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Icon" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("icon") || "—"}</span>
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
        { label: "Active", value: "active", icon: Eye },
        { label: "Inactive", value: "inactive", icon: EyeOff },
      ],
    },
    enableColumnFilter: true,
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
