"use client"

import * as React from "react"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { useDeleteAttributeSet } from "@/hooks/tenant/use-attribute-set-query"
import { exportAttributeSets } from "@/lib/services/tenant/attribute-set-service"
import { ATTRIBUTE_SET_EXPORT_COLUMNS } from "@/lib/export-columns"
import { TenantModuleExportDialog } from "@/components/tenant/admin/components/shared/tenant-module-export-dialog"
import { AttributeSetsFormDialog } from "./attribute-sets-form-dialog"
import { AttributeSetsViewDialog } from "./attribute-sets-view-dialog"
import { AttributeSetsImportDialog } from "./attribute-sets-import-dialog"
import { AttributeSetsMultiDeleteDialog } from "./attribute-sets-multi-delete-dialog"
import { AttributeSetsManageAttributesDialog } from "./attribute-sets-manage-attributes-dialog"
import { useAttributeSets } from "./attribute-sets-provider"

export function AttributeSetsDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    exportSelection,
    setExportSelection,
    deleteManySelection,
    setDeleteManySelection,
  } = useAttributeSets()
  const deleteAttributeSet = useDeleteAttributeSet()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = React.useCallback(() => {
    if (!currentRow) return
    setIsDeleting(true)
    deleteAttributeSet.mutate(currentRow.id, {
      onSuccess: () => {
        toast.success(`Attribute set "${currentRow.name}" deleted successfully`)
        setIsDeleting(false)
        setOpen(null)
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete attribute set")
        setIsDeleting(false)
      },
    })
  }, [currentRow, deleteAttributeSet, setOpen, setCurrentRow])

  return (
    <>
      <AttributeSetsFormDialog
        key="attribute-set-create"
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <AttributeSetsImportDialog
        key="attribute-sets-import"
        open={open === "import"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <TenantModuleExportDialog
        key="attribute-sets-export"
        open={open === "export"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setExportSelection(null)
          }
        }}
        resourceLabel="Attribute Sets"
        columnOptions={ATTRIBUTE_SET_EXPORT_COLUMNS}
        selectedIds={exportSelection?.ids ?? []}
        onExport={exportAttributeSets}
        onComplete={() => {
          exportSelection?.onComplete?.()
          setExportSelection(null)
        }}
      />

      <AttributeSetsMultiDeleteDialog
        key="attribute-sets-delete-many"
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
          <AttributeSetsViewDialog
            key={`attribute-set-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            attributeSet={currentRow}
          />

          <AttributeSetsFormDialog
            key={`attribute-set-update-${currentRow.id}`}
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

          <AttributeSetsManageAttributesDialog
            key={`attribute-set-attributes-${currentRow.id}`}
            open={open === "manageAttributes"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            attributeSet={currentRow}
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
                <ResponsiveDialogTitle>
                  Delete attribute set?
                </ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  You are about to delete &quot;{currentRow.name}&quot;. This
                  action cannot be undone.
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
