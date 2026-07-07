"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { type Brand } from "@/types/tenant/brand"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { DataTableRowActions } from "./data-table-row-actions"
import { Eye, EyeOff, Text } from "lucide-react"

export const columns: ColumnDef<Brand>[] = [
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
    id: "logo",
    header: () => <span className="text-xs font-medium">Logo</span>,
    cell: ({ row }) => (
      <MediaThumbnail
        media={row.original.logo}
        alt={row.original.name}
        size="sm"
      />
    ),
    size: 56,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "banner",
    header: () => <span className="text-xs font-medium">Banner</span>,
    cell: ({ row }) => (
      <MediaThumbnail
        media={row.original.banner}
        alt={`${row.original.name} banner`}
        size="sm"
      />
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
      placeholder: "Search brands...",
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
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Description" />
    ),
    cell: ({ row }) => (
      <span className="max-w-50 truncate text-muted-foreground">
        {row.getValue("description") || "—"}
      </span>
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
