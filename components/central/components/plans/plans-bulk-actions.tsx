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
import { type Plan } from "@/types/central/plan"
import { PlansMultiDeleteDialog } from "./plans-multi-delete-dialog"

type PlansBulkActionsProps<TData> = {
  table: Table<TData>
}

export function PlansBulkActions<TData>({
                                          table,
                                        }: PlansBulkActionsProps<TData>) {
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
    const selectedPlans = selectedRows.map((row) => row.original as Plan)
    toast.promise(sleep(2000), {
      loading: "Exporting plans...",
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedPlans.length} plan${selectedPlans.length > 1 ? "s" : ""} to CSV.`
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

      <PlansMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}