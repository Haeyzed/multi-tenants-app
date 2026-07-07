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
import { type Unit } from "@/types/tenant/unit"
import { useUnits } from "./units-provider"

type UnitsBulkActionsProps<TData> = {
  table: Table<TData>
}

export function UnitsBulkActions<TData>({
  table,
}: UnitsBulkActionsProps<TData>) {
  const { setOpen, setExportSelection, setDeleteManySelection } = useUnits()
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
    const ids = selectedRows.map((row) => (row.original as Unit).id)
    setExportSelection({
      ids,
      onComplete: () => table.resetRowSelection(),
    })
    setOpen("export")
  }

  const handleDeleteMany = () => {
    const ids = selectedRows.map((row) => (row.original as Unit).id)
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
