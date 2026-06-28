"use client"

import * as React from "react"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { useGetTenants } from "@/hooks/central/use-tenant-query"
import { TenantsBulkActions } from "./tenants-bulk-actions"
import { columns } from "./tenants-columns"

export function TenantsTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data, isLoading, error } = useGetTenants({
    search: name || undefined,
    status:
      status.length > 0 ? (status as ("pending" | "active" | "suspended")[]) : undefined,
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
    getRowId: (row) => row.id,
  })

  return (
    <div className="data-table-container space-y-4">
      <DataTable table={table} actionBar={<TenantsBulkActions table={table} />}>
        <DataTableToolbar table={table} />
      </DataTable>

      {isLoading && (
        <div className="py-8 text-center text-muted-foreground">
          Loading tenants...
        </div>
      )}
      {error && (
        <div className="py-8 text-center text-destructive">
          Error: {error.message}
        </div>
      )}
      {!isLoading && tableData.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          No tenants found.
        </div>
      )}
    </div>
  )
}
