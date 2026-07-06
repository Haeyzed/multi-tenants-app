"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { type Attribute } from "@/types/tenant/attribute"
import { DataTableRowActions } from "./data-table-row-actions"
import { Text } from "lucide-react"

const TYPE_OPTIONS = [
  { label: "Select", value: "select" },
  { label: "Text", value: "text" },
  { label: "Textarea", value: "textarea" },
  { label: "Boolean", value: "boolean" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Color", value: "color" },
]

const DISPLAY_TYPE_LABELS: Record<string, string> = {
  dropdown: "Dropdown",
  swatch: "Swatch",
  radio: "Radio",
  checkbox: "Checkbox",
  text_input: "Text Input",
}

export const columns: ColumnDef<Attribute>[] = [
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
      placeholder: "Search attributes...",
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
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Code" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.getValue("code") || "—"}
      </span>
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
      variant: "multiSelect",
      options: TYPE_OPTIONS,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "display_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Display" />
    ),
    cell: ({ row }) => {
      const displayType = row.getValue("display_type") as string
      return (
        <span className="text-sm text-muted-foreground">
          {DISPLAY_TYPE_LABELS[displayType] ?? displayType}
        </span>
      )
    },
  },
  {
    accessorKey: "values_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Values" />
    ),
    cell: ({ row }) => row.getValue("values_count") ?? 0,
  },
  {
    accessorKey: "is_filterable",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Filterable" />
    ),
    cell: ({ row }) => {
      const isFilterable = row.getValue("is_filterable")
      return (
        <Status variant={isFilterable ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>{isFilterable ? "Yes" : "No"}</StatusLabel>
        </Status>
      )
    },
  },
  {
    accessorKey: "is_variant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Variant" />
    ),
    cell: ({ row }) => {
      const isVariant = row.getValue("is_variant")
      return (
        <Status variant={isVariant ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>{isVariant ? "Yes" : "No"}</StatusLabel>
        </Status>
      )
    },
  },
  {
    accessorKey: "sort_order",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Sort" />
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
