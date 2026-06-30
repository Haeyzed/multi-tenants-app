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
import { useGetPlans } from "@/hooks/central/use-plan-query"
import { PlansBulkActions } from "./plans-bulk-actions"
import { columns } from "./plans-columns"

const COLUMN_COUNT = 10
const FILTER_COUNT = 2

export function PlansTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [isActive] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetPlans({
    search: name || undefined,
    is_active:
      isActive.length > 0 ? (isActive as ("active" | "inactive")[]) : undefined,
    per_page: perPage,
    page,
  })

  const tableData = data?.data || []

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageCount: data?.meta?.last_page || 1,
    initialState: {
      sorting: [{ id: "sort_order", desc: false }],
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
        cellWidths={["auto", "10rem", "8rem", "8rem", "8rem", "8rem", "8rem", "6rem", "8rem", "3rem"]}
      />
    )
  }

  return (
    <div className="data-table-container space-y-4">
      <DataTable table={table} actionBar={<PlansBulkActions table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>

      {error && (
        <div className="py-8 text-center text-destructive">
          Error: {error.message}
        </div>
      )}
    </div>
  )
}
