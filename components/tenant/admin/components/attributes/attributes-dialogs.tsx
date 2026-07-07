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
import { useDeleteAttribute } from "@/hooks/tenant/use-attribute-query"
import { exportAttributes } from "@/lib/services/tenant/attribute-service"
import { ATTRIBUTE_EXPORT_COLUMNS } from "@/lib/export-columns"
import { TenantModuleExportDialog } from "@/components/tenant/admin/components/shared/tenant-module-export-dialog"
import { AttributesFormDialog } from "./attributes-form-dialog"
import { AttributesViewDialog } from "./attributes-view-dialog"
import { AttributesImportDialog } from "./attributes-import-dialog"
import { AttributesMultiDeleteDialog } from "./attributes-multi-delete-dialog"
import { AttributesManageValuesDialog } from "./attributes-manage-values-dialog"
import { useAttributes } from "./attributes-provider"

export function AttributesDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    exportSelection,
    setExportSelection,
    deleteManySelection,
    setDeleteManySelection,
  } = useAttributes()
  const deleteAttribute = useDeleteAttribute()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = React.useCallback(() => {
    if (!currentRow) return
    setIsDeleting(true)
    deleteAttribute.mutate(currentRow.id, {
      onSuccess: () => {
        toast.success(`Attribute "${currentRow.name}" deleted successfully`)
        setIsDeleting(false)
        setOpen(null)
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete attribute")
        setIsDeleting(false)
      },
    })
  }, [currentRow, deleteAttribute, setOpen, setCurrentRow])

  return (
    <>
      <AttributesFormDialog
        key="attribute-create"
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <AttributesImportDialog
        key="attributes-import"
        open={open === "import"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <TenantModuleExportDialog
        key="attributes-export"
        open={open === "export"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setExportSelection(null)
          }
        }}
        resourceLabel="Attributes"
        columnOptions={ATTRIBUTE_EXPORT_COLUMNS}
        selectedIds={exportSelection?.ids ?? []}
        onExport={exportAttributes}
        onComplete={() => {
          exportSelection?.onComplete?.()
          setExportSelection(null)
        }}
      />

      <AttributesMultiDeleteDialog
        key="attributes-delete-many"
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
          <AttributesViewDialog
            key={`attribute-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            attribute={currentRow}
          />

          <AttributesFormDialog
            key={`attribute-update-${currentRow.id}`}
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

          <AttributesManageValuesDialog
            key={`attribute-manage-values-${currentRow.id}`}
            open={open === "manageValues"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            attribute={currentRow}
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
                <ResponsiveDialogTitle>Delete attribute?</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  You are about to delete an attribute with the ID{" "}
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
