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
import { useDeleteProduct } from "@/hooks/tenant/use-product-query"
import { exportProducts } from "@/lib/services/tenant/product-service"
import { PRODUCT_EXPORT_COLUMNS } from "@/lib/export-columns"
import { TenantModuleExportDialog } from "@/components/tenant/admin/components/shared/tenant-module-export-dialog"
import { ProductsMultiDeleteDialog } from "./products-multi-delete-dialog"
import { useProducts } from "./products-provider"

export function ProductsDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    exportSelection,
    setExportSelection,
    deleteManySelection,
    setDeleteManySelection,
  } = useProducts()
  const deleteProduct = useDeleteProduct()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = React.useCallback(() => {
    if (!currentRow) return
    setIsDeleting(true)
    deleteProduct.mutate(currentRow.id, {
      onSuccess: () => {
        toast.success(`Product "${currentRow.name}" deleted successfully`)
        setIsDeleting(false)
        setOpen(null)
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete product")
        setIsDeleting(false)
      },
    })
  }, [currentRow, deleteProduct, setOpen, setCurrentRow])

  return (
    <>
      <TenantModuleExportDialog
        key="products-export"
        open={open === "export"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setExportSelection(null)
          }
        }}
        resourceLabel="Products"
        columnOptions={PRODUCT_EXPORT_COLUMNS}
        selectedIds={exportSelection?.ids ?? []}
        onExport={exportProducts}
        onComplete={() => {
          exportSelection?.onComplete?.()
          setExportSelection(null)
        }}
      />

      <ProductsMultiDeleteDialog
        key="products-delete-many"
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
              <ResponsiveDialogTitle>Delete product?</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                You are about to delete <strong>{currentRow.name}</strong>. This
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
      )}
    </>
  )
}
