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
import { useGetCustomers } from "@/hooks/tenant/use-customer-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import { CustomersBulkActions } from "./customers-bulk-actions"
import { columns } from "./customers-columns"

const COLUMN_COUNT = 10
const FILTER_COUNT = 2

export function CustomersTable() {
  const [fullName] = useQueryState("full_name", parseAsString.withDefault(""))
  const [isActive] = useQueryState(
    "is_active",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetCustomers({
    search: fullName || undefined,
    is_active:
      isActive.length > 0 ? (isActive as ("active" | "inactive")[]) : undefined,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error, "Failed to load customers.")

  const tableData = data?.data || []

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageCount: data?.meta?.last_page || 1,
    initialState: {
      sorting: [{ id: "full_name", desc: false }],
      columnPinning: { left: ["select", "full_name"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={COLUMN_COUNT}
        rowCount={perPage}
        filterCount={FILTER_COUNT}
      />
    )
  }

  return (
    <div className="data-table-container space-y-4">
      <DataTable
        table={table}
        actionBar={<CustomersBulkActions table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
