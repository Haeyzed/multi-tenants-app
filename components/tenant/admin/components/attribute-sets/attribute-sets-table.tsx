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
import { useGetAttributeSets } from "@/hooks/tenant/use-attribute-set-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import { AttributeSetsBulkActions } from "./attribute-sets-bulk-actions"
import { columns } from "./attribute-sets-columns"

const COLUMN_COUNT = 9
const FILTER_COUNT = 2

export function AttributeSetsTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [status] = useQueryState(
    "is_active",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const isActiveFilter = React.useMemo((): boolean | undefined => {
    if (status.length !== 1) return undefined
    return status[0] === "active"
  }, [status])

  const { data, isLoading, error } = useGetAttributeSets({
    search: name || undefined,
    is_active: isActiveFilter,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error, "Failed to load attribute sets.")

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
        cellWidths={["auto", "10rem", "8rem", "12rem", "8rem", "6rem", "6rem", "4rem", "3rem"]}
      />
    )
  }

  return (
    <div className="data-table-container space-y-4">
      <DataTable
        table={table}
        actionBar={<AttributeSetsBulkActions table={table} />}
      >
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
