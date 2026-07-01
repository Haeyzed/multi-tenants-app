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
import { useGetUsers } from "@/hooks/central/use-user-query"
import { UsersBulkActions } from "./users-bulk-actions"
import { columns } from "./users-columns"

const COLUMN_COUNT = 6
const FILTER_COUNT = 2

export function UsersTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [isActive] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetUsers({
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
      <DataTable table={table} actionBar={<UsersBulkActions table={table} />}>
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
