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
import { useGetCustomerGroups } from "@/hooks/tenant/use-customer-group-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import { CustomerGroupsBulkActions } from "./customer-groups-bulk-actions"
import { columns } from "./customer-groups-columns"

const COLUMN_COUNT = 8
const FILTER_COUNT = 2

export function CustomerGroupsTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [isActive] = useQueryState(
    "is_active",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetCustomerGroups({
    search: name || undefined,
    is_active:
      isActive.length > 0 ? (isActive as ("active" | "inactive")[]) : undefined,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error, "Failed to load customer groups.")

  const tableData = data?.data || []

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageCount: data?.meta?.last_page || 1,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnPinning: { left: ["select", "name"], right: ["actions"] },
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
        actionBar={<CustomerGroupsBulkActions table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
