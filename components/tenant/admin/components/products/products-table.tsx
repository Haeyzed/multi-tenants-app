"use client"

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
import { useGetProducts } from "@/hooks/tenant/use-product-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import { type Product } from "@/types/tenant/product"
import { ProductsBulkActions } from "./products-bulk-actions"
import { columns } from "./products-columns"

const COLUMN_COUNT = 10
const FILTER_COUNT = 2

export function ProductsTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetProducts({
    search: name || undefined,
    status: status.length > 0 ? (status as Product["status"][]) : undefined,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error, "Failed to load products.")

  const tableData = data?.data || []

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageCount: data?.meta?.last_page || 1,
    initialState: {
      sorting: [{ id: "created_at", desc: true }],
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
      <DataTable table={table} actionBar={<ProductsBulkActions table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
