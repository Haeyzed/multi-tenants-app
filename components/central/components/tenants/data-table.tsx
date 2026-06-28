"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { columns } from "./columns"
import { useGetTenants } from "@/lib/hooks/use-tenant-query";
import { TenantDialog } from "./tenant-dialog";
import { Button } from "@/components/ui/button";

export function DataTableDemo() {
  const { data, isLoading } = useGetTenants();
  const [name] = useQueryState("name", parseAsString.withDefault(""));
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const { table } = useDataTable({
    data: data || [],
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: "name", desc: true }],
      columnPinning: { left: ["select", "name"] , right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <TenantDialog>
            <Button>Create Tenant</Button>
          </TenantDialog>
        </DataTableToolbar>
      </DataTable>
    </div>
  );
}