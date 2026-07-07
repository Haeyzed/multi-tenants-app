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
import { useGetCollections } from "@/hooks/tenant/use-collection-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import { type CollectionType } from "@/types/tenant/collection"
import { CollectionsBulkActions } from "./collections-bulk-actions"
import { columns } from "./collections-columns"

const COLUMN_COUNT = 9
const FILTER_COUNT = 4

export function CollectionsTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [visibility] = useQueryState(
    "is_visible",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [featured] = useQueryState(
    "is_featured",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [type] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetCollections({
    search: name || undefined,
    is_visible:
      visibility.length > 0
        ? (visibility as ("visible" | "hidden")[])
        : undefined,
    is_featured: featured.length > 0 ? featured[0] === "true" : undefined,
    type: type.length > 0 ? (type[0] as CollectionType) : undefined,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error, "Failed to load collections.")

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
          "8rem",
          "8rem",
          "6rem",
          "6rem",
          "3rem",
        ]}
      />
    )
  }

  return (
    <div className="data-table-container space-y-4">
      <DataTable
        table={table}
        actionBar={<CollectionsBulkActions table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
