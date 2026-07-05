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
import { useGetUnits } from "@/hooks/tenant/use-unit-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import { type UnitType } from "@/types/tenant/unit"
import { UnitsBulkActions } from "./units-bulk-actions"
import { columns } from "./units-columns"

const COLUMN_COUNT = 10
const FILTER_COUNT = 2

export function UnitsTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [type] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetUnits({
    search: name || undefined,
    type: type.length > 0 ? (type as UnitType[]) : undefined,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error, "Failed to load units.")

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
        cellWidths={["auto", "6rem", "4rem", "6rem", "6rem", "4rem", "4rem", "3rem"]}
      />
    )
  }

  return (
    <div className="data-table-container space-y-4">
      <DataTable
        table={table}
        actionBar={<UnitsBulkActions table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
