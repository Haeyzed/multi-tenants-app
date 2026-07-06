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
import { useDeleteSupplier } from "@/hooks/tenant/use-supplier-query"
import { exportSuppliers } from "@/lib/services/tenant/supplier-service"
import { SUPPLIER_EXPORT_COLUMNS } from "@/lib/export-columns"
import { TenantModuleExportDialog } from "@/components/tenant/admin/components/shared/tenant-module-export-dialog"
import { SuppliersFormDialog } from "./suppliers-form-dialog"
import { SuppliersViewDialog } from "./suppliers-view-dialog"
import { SuppliersImportDialog } from "./suppliers-import-dialog"
import { SuppliersMultiDeleteDialog } from "./suppliers-multi-delete-dialog"
import { SuppliersManageContactsDialog } from "./suppliers-manage-contacts-dialog"
import { SuppliersManageAddressesDialog } from "./suppliers-manage-addresses-dialog"
import { SuppliersManageBankAccountsDialog } from "./suppliers-manage-bank-accounts-dialog"
import { useSuppliers } from "./suppliers-provider"

export function SuppliersDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    exportSelection,
    setExportSelection,
    deleteManySelection,
    setDeleteManySelection,
  } = useSuppliers()
  const deleteSupplier = useDeleteSupplier()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = React.useCallback(() => {
    if (!currentRow) return
    setIsDeleting(true)
    deleteSupplier.mutate(currentRow.id, {
      onSuccess: () => {
        toast.success(`Supplier "${currentRow.name}" deleted successfully`)
        setIsDeleting(false)
        setOpen(null)
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete supplier")
        setIsDeleting(false)
      },
    })
  }, [currentRow, deleteSupplier, setOpen, setCurrentRow])

  return (
    <>
      <SuppliersFormDialog
        key="supplier-create"
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <SuppliersImportDialog
        key="suppliers-import"
        open={open === "import"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <TenantModuleExportDialog
        key="suppliers-export"
        open={open === "export"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setExportSelection(null)
          }
        }}
        resourceLabel="Suppliers"
        columnOptions={SUPPLIER_EXPORT_COLUMNS}
        selectedIds={exportSelection?.ids ?? []}
        onExport={exportSuppliers}
        onComplete={() => {
          exportSelection?.onComplete?.()
          setExportSelection(null)
        }}
      />

      <SuppliersMultiDeleteDialog
        key="suppliers-delete-many"
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
          <SuppliersViewDialog
            key={`supplier-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            supplier={currentRow}
          />

          <SuppliersFormDialog
            key={`supplier-update-${currentRow.id}`}
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

          <SuppliersManageContactsDialog
            key={`supplier-contacts-${currentRow.id}`}
            open={open === "manageContacts"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            supplier={currentRow}
          />

          <SuppliersManageAddressesDialog
            key={`supplier-addresses-${currentRow.id}`}
            open={open === "manageAddresses"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            supplier={currentRow}
          />

          <SuppliersManageBankAccountsDialog
            key={`supplier-bank-accounts-${currentRow.id}`}
            open={open === "manageBankAccounts"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            supplier={currentRow}
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
                <ResponsiveDialogTitle>Delete supplier?</ResponsiveDialogTitle>
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
