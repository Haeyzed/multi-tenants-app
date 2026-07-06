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
import { useDeleteCustomerGroup } from "@/hooks/tenant/use-customer-group-query"
import { exportCustomerGroups } from "@/lib/services/tenant/customer-group-service"
import { CUSTOMER_GROUP_EXPORT_COLUMNS } from "@/lib/export-columns"
import { TenantModuleExportDialog } from "@/components/tenant/admin/components/shared/tenant-module-export-dialog"
import { CustomerGroupsFormDialog } from "./customer-groups-form-dialog"
import { CustomerGroupsViewDialog } from "./customer-groups-view-dialog"
import { CustomerGroupsImportDialog } from "./customer-groups-import-dialog"
import { CustomerGroupsMultiDeleteDialog } from "./customer-groups-multi-delete-dialog"
import { useCustomerGroups } from "./customer-groups-provider"

export function CustomerGroupsDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    exportSelection,
    setExportSelection,
    deleteManySelection,
    setDeleteManySelection,
  } = useCustomerGroups()
  const deleteCustomerGroup = useDeleteCustomerGroup()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = React.useCallback(() => {
    if (!currentRow) return
    setIsDeleting(true)
    deleteCustomerGroup.mutate(currentRow.id, {
      onSuccess: () => {
        toast.success(
          `Customer group "${currentRow.name}" deleted successfully`
        )
        setIsDeleting(false)
        setOpen(null)
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete customer group")
        setIsDeleting(false)
      },
    })
  }, [currentRow, deleteCustomerGroup, setOpen, setCurrentRow])

  return (
    <>
      <CustomerGroupsFormDialog
        key="customer-group-create"
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <CustomerGroupsImportDialog
        key="customer-groups-import"
        open={open === "import"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <TenantModuleExportDialog
        key="customer-groups-export"
        open={open === "export"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setExportSelection(null)
          }
        }}
        resourceLabel="Customer Groups"
        columnOptions={CUSTOMER_GROUP_EXPORT_COLUMNS}
        selectedIds={exportSelection?.ids ?? []}
        onExport={exportCustomerGroups}
        onComplete={() => {
          exportSelection?.onComplete?.()
          setExportSelection(null)
        }}
      />

      <CustomerGroupsMultiDeleteDialog
        key="customer-groups-delete-many"
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
          <CustomerGroupsViewDialog
            key={`customer-group-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            group={currentRow}
          />

          <CustomerGroupsFormDialog
            key={`customer-group-update-${currentRow.id}`}
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
                <ResponsiveDialogTitle>
                  Delete customer group?
                </ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  You are about to delete a customer group with the ID{" "}
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
