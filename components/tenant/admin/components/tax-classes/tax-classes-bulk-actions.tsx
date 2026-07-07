"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { Download, Trash2 } from "lucide-react"
import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
} from "@/components/ui/action-bar"
import { type TaxClass } from "@/types/tenant/tax-class"
import { useTaxClasses } from "./tax-classes-provider"

type TaxClassesBulkActionsProps<TData> = {
  table: Table<TData>
}

export function TaxClassesBulkActions<TData>({
  table,
}: TaxClassesBulkActionsProps<TData>) {
  const { setOpen, setExportSelection, setDeleteManySelection } =
    useTaxClasses()
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
    const ids = selectedRows.map((row) => (row.original as TaxClass).id)
    setExportSelection({
      ids,
      onComplete: () => table.resetRowSelection(),
    })
    setOpen("export")
  }

  const handleDeleteMany = () => {
    const ids = selectedRows.map((row) => (row.original as TaxClass).id)
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
