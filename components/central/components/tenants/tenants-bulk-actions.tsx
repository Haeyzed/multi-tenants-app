"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { Trash2, Download } from "lucide-react"
import { toast } from "sonner"
import { sleep } from "@/lib/utils"
import {
  ActionBar,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarClose,
} from "@/components/ui/action-bar"
import { type Tenant } from "@/types/central/tenant"
import { TenantsMultiDeleteDialog } from "./tenants-multi-delete-dialog"

type TenantsBulkActionsProps<TData> = {
  table: Table<TData>
}

export function TenantsBulkActions<TData>({
                                          table,
                                        }: TenantsBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false)
      }
    },
    [table]
  )

  const handleBulkExport = () => {
    const selectedTenants = selectedRows.map((row) => row.original as Tenant)
    toast.promise(sleep(2000), {
      loading: "Exporting tenants...",
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedTenants.length} tenant${selectedTenants.length > 1 ? "s" : ""} to CSV.`
      },
      error: "Error",
    })
    table.resetRowSelection()
  }

  return (
    <>
      <ActionBar
        open={selectedRows.length > 0}
        onOpenChange={onOpenChange}
      >
        <ActionBarGroup>
          <ActionBarSelection>
            {selectedRows.length} selected
          </ActionBarSelection>
          <ActionBarItem onClick={handleBulkExport}>
            <Download className="size-4" />
            Export
          </ActionBarItem>
          <ActionBarItem onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="size-4" />
            Delete
          </ActionBarItem>
        </ActionBarGroup>
        <ActionBarClose />
      </ActionBar>

      <TenantsMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
