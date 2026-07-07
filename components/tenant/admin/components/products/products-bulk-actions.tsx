"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { CheckCircle2, Download, EyeOff, Trash2 } from "lucide-react"
import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
} from "@/components/ui/action-bar"
import { type Product } from "@/types/tenant/product"
import { useProducts } from "./products-provider"

type ProductsBulkActionsProps<TData> = {
  table: Table<TData>
}

export function ProductsBulkActions<TData>({
  table,
}: ProductsBulkActionsProps<TData>) {
  const {
    setOpen,
    setExportSelection,
    setDeleteManySelection,
    setBulkUpdateSelection,
  } = useProducts()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false)
      }
    },
    [table]
  )

  const selectedIds = selectedRows.map((row) => (row.original as Product).id)

  const handleExport = () => {
    setExportSelection({
      ids: selectedIds,
      onComplete: () => table.resetRowSelection(),
    })
    setOpen("export")
  }

  const handleDeleteMany = () => {
    setDeleteManySelection({
      ids: selectedIds,
      onComplete: () => table.resetRowSelection(),
    })
    setOpen("deleteMany")
  }

  const handleBulkStatus = () => {
    setBulkUpdateSelection({
      ids: selectedIds,
      onComplete: () => table.resetRowSelection(),
    })
    setOpen("bulkStatus")
  }

  const handleBulkVisibility = () => {
    setBulkUpdateSelection({
      ids: selectedIds,
      onComplete: () => table.resetRowSelection(),
    })
    setOpen("bulkVisibility")
  }

  return (
    <ActionBar open={selectedRows.length > 0} onOpenChange={onOpenChange}>
      <ActionBarGroup>
        <ActionBarSelection>{selectedRows.length} selected</ActionBarSelection>
        <ActionBarItem onClick={handleBulkStatus}>
          <CheckCircle2 className="size-4" />
          Set status
        </ActionBarItem>
        <ActionBarItem onClick={handleBulkVisibility}>
          <EyeOff className="size-4" />
          Set visibility
        </ActionBarItem>
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
