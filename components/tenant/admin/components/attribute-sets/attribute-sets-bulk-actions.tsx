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
import { type AttributeSet } from "@/types/tenant/attribute-set"
import { useAttributeSets } from "./attribute-sets-provider"

type AttributeSetsBulkActionsProps<TData> = {
  table: Table<TData>
}

export function AttributeSetsBulkActions<TData>({
  table,
}: AttributeSetsBulkActionsProps<TData>) {
  const { setOpen, setExportSelection, setDeleteManySelection } =
    useAttributeSets()
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
    const ids = selectedRows.map((row) => (row.original as AttributeSet).id)
    setExportSelection({
      ids,
      onComplete: () => table.resetRowSelection(),
    })
    setOpen("export")
  }

  const handleDeleteMany = () => {
    const ids = selectedRows.map((row) => (row.original as AttributeSet).id)
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
