"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { type Category } from "@/types/tenant/category"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { DataTableRowActions } from "./data-table-row-actions"
import { Text, Eye, EyeOff } from "lucide-react"

export const columns: ColumnDef<Category>[] = [
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
    id: "image",
    header: () => <span className="text-xs font-medium">Image</span>,
    cell: ({ row }) => (
      <MediaThumbnail media={row.original.image} alt={row.original.name} size="sm" />
    ),
    size: 56,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "banner",
    header: () => <span className="text-xs font-medium">Banner</span>,
    cell: ({ row }) => (
      <MediaThumbnail media={row.original.banner} alt={`${row.original.name} banner`} size="sm" />
    ),
    size: 56,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    meta: {
      label: "Name",
      placeholder: "Search categories...",
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
    id: "parent",
    accessorFn: (row) => row.parent?.name ?? "—",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Parent" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.parent?.name ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "sort_order",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Order" />
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
