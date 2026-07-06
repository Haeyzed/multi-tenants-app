"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { Badge } from "@/components/ui/badge"
import { type Collection } from "@/types/tenant/collection"
import { DataTableRowActions } from "./data-table-row-actions"
import { Eye, EyeOff, Star, Text } from "lucide-react"

const TYPE_OPTIONS = [
  { label: "Manual", value: "manual" },
  { label: "Automated", value: "automated" },
]

const FEATURED_OPTIONS = [
  { label: "Featured", value: "true", icon: Star },
  { label: "Not featured", value: "false" },
]

export const columns: ColumnDef<Collection>[] = [
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
      placeholder: "Search collections...",
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
      variant: "select",
      options: TYPE_OPTIONS,
    },
    enableColumnFilter: true,
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
    accessorKey: "is_featured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Featured" />
    ),
    cell: ({ row }) =>
      row.original.is_featured ? (
        <Star className="size-4 fill-amber-400 text-amber-400" />
      ) : (
        "—"
      ),
    meta: {
      label: "Featured",
      variant: "select",
      options: FEATURED_OPTIONS,
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
      <DataTableColumnHeader column={column} label="Sort Order" />
    ),
    cell: ({ row }) => row.getValue("sort_order"),
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
