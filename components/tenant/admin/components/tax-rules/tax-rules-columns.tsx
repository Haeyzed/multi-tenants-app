"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { Badge } from "@/components/ui/badge"
import {
  type TaxRule,
  type TaxRuleApplicableType,
  type TaxRuleType,
} from "@/types/tenant/tax-rule"
import { DataTableRowActions } from "./data-table-row-actions"
import { Text, CheckCircle, XCircle } from "lucide-react"

const APPLICABLE_TYPE_LABELS: Record<TaxRuleApplicableType, string> = {
  product: "Product",
  customer_group: "Customer Group",
}

const RULE_TYPE_LABELS: Record<TaxRuleType, string> = {
  override: "Override",
  exempt: "Exempt",
  reduce: "Reduce",
  increase: "Increase",
}

export const columns: ColumnDef<TaxRule>[] = [
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
    id: "tax_rate",
    accessorFn: (row) => row.tax_rate?.name ?? "—",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Tax Rate" />
    ),
    meta: {
      label: "Search",
      placeholder: "Search tax rules...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {row.original.tax_rate?.name ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "applicable_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Applicable Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue<TaxRuleApplicableType>("applicable_type")
      return (
        <Badge variant="outline">{APPLICABLE_TYPE_LABELS[type] ?? type}</Badge>
      )
    },
  },
  {
    accessorKey: "applicable_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Applicable ID" />
    ),
    cell: ({ row }) => row.getValue("applicable_id"),
  },
  {
    accessorKey: "rule_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Rule Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue<TaxRuleType>("rule_type")
      return (
        <Badge variant="secondary">{RULE_TYPE_LABELS[type] ?? type}</Badge>
      )
    },
  },
  {
    accessorKey: "adjustment_rate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Adjustment" />
    ),
    cell: ({ row }) => {
      const rate = row.getValue<string | null>("adjustment_rate")
      return rate !== null ? `${rate}%` : "—"
    },
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
