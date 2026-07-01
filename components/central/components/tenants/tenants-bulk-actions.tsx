"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { Trash2, Download } from "lucide-react"
import {
  ActionBar,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarClose,
} from "@/components/ui/action-bar"
import { type Tenant } from "@/types/central/tenant"
import { useTenants } from "./tenants-provider"

type TenantsBulkActionsProps<TData> = {
  table: Table<TData>
}

export function TenantsBulkActions<TData>({
  table,
}: TenantsBulkActionsProps<TData>) {
  const { setOpen, setExportSelection, setDeleteManySelection } = useTenants()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false)
      }
    },
    [table]
  )

  const handleExport = () => {
    const ids = selectedRows.map((row) => (row.original as Tenant).id)
    setExportSelection({
      ids,
      onComplete: () => table.resetRowSelection(),
    })
    setOpen("export")
  }

  const handleDeleteMany = () => {
    const ids = selectedRows.map((row) => (row.original as Tenant).id)
    setDeleteManySelection({
      ids,
      onComplete: () => table.resetRowSelection(),
    })
    setOpen("deleteMany")
  }

  return (
    <ActionBar open={selectedRows.length > 0} onOpenChange={onOpenChange}>
      <ActionBarGroup>
        <ActionBarSelection>{selectedRows.length} selected</ActionBarSelection>
        <ActionBarItem onClick={handleExport}>
          <Download className="size-4" />
          Export
        </ActionBarItem>
        <ActionBarItem onClick={handleDeleteMany}>
          <Trash2 className="size-4" />
          Delete
        </ActionBarItem>
      </ActionBarGroup>
      <ActionBarClose />
    </ActionBar>
  )
}
