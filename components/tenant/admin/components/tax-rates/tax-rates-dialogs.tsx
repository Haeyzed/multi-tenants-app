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
import { useDeleteTaxRate } from "@/hooks/tenant/use-tax-rate-query"
import { exportTaxRates } from "@/lib/services/tenant/tax-rate-service"
import { TAX_RATE_EXPORT_COLUMNS } from "@/lib/export-columns"
import { TenantModuleExportDialog } from "@/components/tenant/admin/components/shared/tenant-module-export-dialog"
import { TaxRatesMutateDialog } from "./tax-rates-mutate-dialog"
import { TaxRatesViewDialog } from "./tax-rates-view-dialog"
import { TaxRatesImportDialog } from "./tax-rates-import-dialog"
import { TaxRatesMultiDeleteDialog } from "./tax-rates-multi-delete-dialog"
import { useTaxRates } from "./tax-rates-provider"

export function TaxRatesDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    exportSelection,
    setExportSelection,
    deleteManySelection,
    setDeleteManySelection,
  } = useTaxRates()
  const deleteTaxRate = useDeleteTaxRate()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = React.useCallback(() => {
    if (!currentRow) return
    setIsDeleting(true)
    deleteTaxRate.mutate(currentRow.id, {
      onSuccess: () => {
        toast.success(`Tax rate "${currentRow.name}" deleted successfully`)
        setIsDeleting(false)
        setOpen(null)
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete tax rate")
        setIsDeleting(false)
      },
    })
  }, [currentRow, deleteTaxRate, setOpen, setCurrentRow])

  return (
    <>
      <TaxRatesMutateDialog
        key="tax-rate-create"
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <TaxRatesImportDialog
        key="tax-rates-import"
        open={open === "import"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <TenantModuleExportDialog
        key="tax-rates-export"
        open={open === "export"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setExportSelection(null)
          }
        }}
        resourceLabel="Tax Rates"
        columnOptions={TAX_RATE_EXPORT_COLUMNS}
        selectedIds={exportSelection?.ids ?? []}
        onExport={exportTaxRates}
        onComplete={() => {
          exportSelection?.onComplete?.()
          setExportSelection(null)
        }}
      />

      <TaxRatesMultiDeleteDialog
        key="tax-rates-delete-many"
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
          <TaxRatesViewDialog
            key={`tax-rate-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            taxRate={currentRow}
          />

          <TaxRatesMutateDialog
            key={`tax-rate-update-${currentRow.id}`}
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
                <ResponsiveDialogTitle>Delete tax rate?</ResponsiveDialogTitle>
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
