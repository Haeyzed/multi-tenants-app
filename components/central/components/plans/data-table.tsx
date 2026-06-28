"use client"

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import * as React from "react"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { columns } from "./columns"
import { useGetPlans } from "@/hooks/central/use-plan-query"
import { PlanDialog } from "./plan-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Guard } from "@/components/central/components/auth/guard"

export function PlanDataTable() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  )
  const [isActive, setIsActive] = useQueryState(
    "is_active",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage, setPerPage] = useQueryState(
    "per_page",
    parseAsInteger.withDefault(15)
  )

  const { data, isLoading } = useGetPlans({
    search: search || undefined,
    is_active:
      isActive.length > 0 ? (isActive as ("active" | "inactive")[]) : undefined,
    per_page: perPage,
    page,
  })

  const { table } = useDataTable({
    data: data?.data || [],
    columns,
    pageCount: data?.meta?.last_page || 1,
    initialState: {
      sorting: [{ id: "sort_order", desc: false }],
      columnPinning: { left: ["select", "name"], right: ["actions"] },
    },
    getRowId: (row) => String(row.id),
  })

  return (
    <div className="space-y-4">
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[250px]"
            />
            <Guard permissions="plans.create">
              <PlanDialog>
                <Button>Create Plan</Button>
              </PlanDialog>
            </Guard>
          </div>
        </DataTableToolbar>
      </DataTable>
      {isLoading && (
        <div className="py-8 text-center text-muted-foreground">
          Loading plans...
        </div>
      )}
    </div>
  )
}
