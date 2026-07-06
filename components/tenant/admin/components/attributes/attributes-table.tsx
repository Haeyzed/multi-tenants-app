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
import { useGetAttributes } from "@/hooks/tenant/use-attribute-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import { AttributesBulkActions } from "./attributes-bulk-actions"
import { columns } from "./attributes-columns"

const COLUMN_COUNT = 11
const FILTER_COUNT = 2

export function AttributesTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [type] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetAttributes({
    search: name || undefined,
    type: type.length > 0 ? type.join(",") : undefined,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error, "Failed to load attributes.")

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
        cellWidths={[
          "auto",
          "10rem",
          "8rem",
          "6rem",
          "6rem",
          "8rem",
          "5rem",
          "5rem",
          "5rem",
          "4rem",
          "3rem",
        ]}
      />
    )
  }

  return (
    <div className="data-table-container space-y-4">
      <DataTable
        table={table}
        actionBar={<AttributesBulkActions table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
