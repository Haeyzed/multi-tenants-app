"use client";

import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { columns } from "./columns";
import { useGetTenants } from "@/hooks/central/use-tenant-query";
import { TenantDialog } from "./tenant-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Guard } from "@/components/central/components/auth/guard";

export function TenantDataTable() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [status, setStatus] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage, setPerPage] = useQueryState("per_page", parseAsInteger.withDefault(15));

  const { data, isLoading } = useGetTenants({
    search: search || undefined,
    status: status.length > 0 ? (status as ("pending" | "active" | "suspended")[]) : undefined,
    per_page: perPage,
    page,
  });

  const { table } = useDataTable({
    data: data?.data || [],
    columns,
    pageCount: data?.meta?.last_page || 1,
    initialState: {
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: { left: ["select", "name"], right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="space-y-4">
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search tenants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[250px]"
            />
            <Guard permissions="tenants.create">
              <TenantDialog>
                <Button>Create Tenant</Button>
              </TenantDialog>
            </Guard>
          </div>
        </DataTableToolbar>
      </DataTable>
      {isLoading && (
        <div className="text-center text-muted-foreground py-8">Loading tenants...</div>
      )}
    </div>
  );
}