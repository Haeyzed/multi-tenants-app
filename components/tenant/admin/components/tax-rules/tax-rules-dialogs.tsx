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
import { useDeleteTaxRule } from "@/hooks/tenant/use-tax-rule-query"
import { exportTaxRules } from "@/lib/services/tenant/tax-rule-service"
import { TAX_RULE_EXPORT_COLUMNS } from "@/lib/export-columns"
import { TenantModuleExportDialog } from "@/components/tenant/admin/components/shared/tenant-module-export-dialog"
import { TaxRulesFormDialog } from "./tax-rules-form-dialog"
import { TaxRulesViewDialog } from "./tax-rules-view-dialog"
import { TaxRulesMultiDeleteDialog } from "./tax-rules-multi-delete-dialog"
import { useTaxRules } from "./tax-rules-provider"

export function TaxRulesDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    exportSelection,
    setExportSelection,
    deleteManySelection,
    setDeleteManySelection,
  } = useTaxRules()
  const deleteTaxRule = useDeleteTaxRule()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = React.useCallback(() => {
    if (!currentRow) return
    setIsDeleting(true)
    deleteTaxRule.mutate(currentRow.id, {
      onSuccess: () => {
        toast.success(`Tax rule #${currentRow.id} deleted successfully`)
        setIsDeleting(false)
        setOpen(null)
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete tax rule")
        setIsDeleting(false)
      },
    })
  }, [currentRow, deleteTaxRule, setOpen, setCurrentRow])

  return (
    <>
      <TaxRulesFormDialog
        key="tax-rule-create"
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <TenantModuleExportDialog
        key="tax-rules-export"
        open={open === "export"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setExportSelection(null)
          }
        }}
        resourceLabel="Tax Rules"
        columnOptions={TAX_RULE_EXPORT_COLUMNS}
        selectedIds={exportSelection?.ids ?? []}
        onExport={exportTaxRules}
        onComplete={() => {
          exportSelection?.onComplete?.()
          setExportSelection(null)
        }}
      />

      <TaxRulesMultiDeleteDialog
        key="tax-rules-delete-many"
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
          <TaxRulesViewDialog
            key={`tax-rule-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            taxRule={currentRow}
          />

          <TaxRulesFormDialog
            key={`tax-rule-update-${currentRow.id}`}
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
                <ResponsiveDialogTitle>Delete tax rule?</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  You are about to delete tax rule #{currentRow.id}
                  {currentRow.tax_rate?.name
                    ? ` (${currentRow.tax_rate.name})`
                    : ""}
                  . This action cannot be undone.
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
