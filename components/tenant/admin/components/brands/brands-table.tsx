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
import { useGetBrands } from "@/hooks/tenant/use-brand-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import { BrandsBulkActions } from "./brands-bulk-actions"
import { columns } from "./brands-columns"

const COLUMN_COUNT = 9
const FILTER_COUNT = 2

export function BrandsTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [visibility] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetBrands({
    search: name || undefined,
    is_visible:
      visibility.length > 0
        ? (visibility as ("visible" | "hidden")[])
        : undefined,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error, "Failed to load brands.")

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
        cellWidths={["auto", "10rem", "8rem", "12rem", "8rem", "8rem", "3rem"]}
      />
    )
  }

  return (
    <div className="data-table-container space-y-4">
      <DataTable table={table} actionBar={<BrandsBulkActions table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
