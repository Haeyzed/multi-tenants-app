"use client"

import * as React from "react"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogClose,
} from "@/components/ui/responsive-dialog"
import { useDeletePlan } from "@/hooks/central/use-plan-query"
import { exportPlans } from "@/lib/services/central/plan-service"
import { PLAN_EXPORT_COLUMNS } from "@/lib/export-columns"
import { ModuleExportDialog } from "@/components/central/components/shared/module-export-dialog"
import { PlansMutateDialog } from "./plans-mutate-dialog"
import { PlansImportDialog } from "./plans-import-dialog"
import { PlansMultiDeleteDialog } from "./plans-multi-delete-dialog"
import { usePlans } from "./plans-provider"

export function PlansDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    exportSelection,
    setExportSelection,
    deleteManySelection,
    setDeleteManySelection,
  } = usePlans()
  const deletePlan = useDeletePlan()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = React.useCallback(() => {
    if (!currentRow) return
    setIsDeleting(true)
    deletePlan.mutate(currentRow.id, {
      onSuccess: () => {
        toast.success(`Plan "${currentRow.name}" deleted successfully`)
        setIsDeleting(false)
        setOpen(null)
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete plan")
        setIsDeleting(false)
      },
    })
  }, [currentRow, deletePlan, setOpen, setCurrentRow])

  return (
    <>
      <PlansMutateDialog
        key="plan-create"
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <PlansImportDialog
        key="plans-import"
        open={open === "import"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <ModuleExportDialog
        key="plans-export"
        open={open === "export"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setExportSelection(null)
          }
        }}
        resourceLabel="Plans"
        columnOptions={PLAN_EXPORT_COLUMNS}
        selectedIds={exportSelection?.ids ?? []}
        onExport={exportPlans}
        onComplete={() => {
          exportSelection?.onComplete?.()
          setExportSelection(null)
        }}
      />

      <PlansMultiDeleteDialog
        key="plans-delete-many"
        open={open === "deleteMany"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setDeleteManySelection(null)
          }
        }}
        ids={(deleteManySelection?.ids ?? []) as number[]}
        onComplete={() => {
          deleteManySelection?.onComplete?.()
          setDeleteManySelection(null)
        }}
      />

      {currentRow && (
        <>
          <PlansMutateDialog
            key={`plan-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            currentRow={currentRow}
          />

          <ResponsiveDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
          >
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Delete plan?</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  You are about to delete a plan with the ID{" "}
                  <strong>{currentRow.id}</strong>. This action cannot be
                  undone.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting && <Spinner />}
                  Delete
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </>
      )}
    </>
  )
}