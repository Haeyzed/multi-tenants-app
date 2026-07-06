"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { type Tag } from "@/types/tenant/tag"
import { DataTableRowActions } from "./data-table-row-actions"
import { Text, Eye, EyeOff } from "lucide-react"

export const columns: ColumnDef<Tag>[] = [
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
      placeholder: "Search tags...",
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
    cell: ({ row }) => {
      const color = row.getValue("color") as string | null
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
    },
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
    accessorKey: "is_visible",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Visibility" />
    ),
    cell: ({ row }) => {
      const isVisible = row.getValue("is_visible")
      return (
        <Status variant={isVisible ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>{isVisible ? "Visible" : "Hidden"}</StatusLabel>
        </Status>
      )
    },
    meta: {
      label: "Visibility",
      variant: "multiSelect",
      options: [
        { label: "Visible", value: "visible", icon: Eye },
        { label: "Hidden", value: "hidden", icon: EyeOff },
      ],
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "products_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Products" />
    ),
    cell: ({ row }) => row.original.products_count ?? 0,
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
