"use client"

import * as React from "react"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { useGetTaxRules } from "@/hooks/tenant/use-tax-rule-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import { TaxRulesBulkActions } from "./tax-rules-bulk-actions"
import { columns } from "./tax-rules-columns"

const COLUMN_COUNT = 9
const FILTER_COUNT = 2

export function TaxRulesTable() {
  const [search] = useQueryState("tax_rate", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "is_active",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetTaxRules({
    search: search || undefined,
    is_active:
      status.length > 0
        ? (status as ("active" | "inactive")[])
        : undefined,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error, "Failed to load tax rules.")

  const tableData = data?.data || []

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageCount: data?.meta?.last_page || 1,
    initialState: {
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: { left: ["select", "tax_rate"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={COLUMN_COUNT}
        rowCount={perPage}
        filterCount={FILTER_COUNT}
        cellWidths={["auto", "8rem", "8rem", "6rem", "6rem", "6rem", "6rem"]}
      />
    )
  }

  return (
    <div className="data-table-container space-y-4">
      <DataTable
        table={table}
        actionBar={<TaxRulesBulkActions table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
