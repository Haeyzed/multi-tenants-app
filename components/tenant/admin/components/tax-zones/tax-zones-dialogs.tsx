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
import { useDeleteTaxZone } from "@/hooks/tenant/use-tax-zone-query"
import { exportTaxZones } from "@/lib/services/tenant/tax-zone-service"
import { TAX_ZONE_EXPORT_COLUMNS } from "@/lib/export-columns"
import { TenantModuleExportDialog } from "@/components/tenant/admin/components/shared/tenant-module-export-dialog"
import { TaxZonesFormDialog } from "./tax-zones-form-dialog"
import { TaxZonesViewDialog } from "./tax-zones-view-dialog"
import { TaxZoneMapDialog } from "./tax-zone-map-dialog"
import { TaxZonesImportDialog } from "./tax-zones-import-dialog"
import { TaxZonesMultiDeleteDialog } from "./tax-zones-multi-delete-dialog"
import { useTaxZones } from "./tax-zones-provider"

export function TaxZonesDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    exportSelection,
    setExportSelection,
    deleteManySelection,
    setDeleteManySelection,
  } = useTaxZones()
  const deleteTaxZone = useDeleteTaxZone()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = React.useCallback(() => {
    if (!currentRow) return
    setIsDeleting(true)
    deleteTaxZone.mutate(currentRow.id, {
      onSuccess: () => {
        toast.success(`Tax zone "${currentRow.name}" deleted successfully`)
        setIsDeleting(false)
        setOpen(null)
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete tax zone")
        setIsDeleting(false)
      },
    })
  }, [currentRow, deleteTaxZone, setOpen, setCurrentRow])

  return (
    <>
      <TaxZonesFormDialog
        key="tax-zone-create"
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <TaxZonesImportDialog
        key="tax-zones-import"
        open={open === "import"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <TenantModuleExportDialog
        key="tax-zones-export"
        open={open === "export"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setExportSelection(null)
          }
        }}
        resourceLabel="Tax Zones"
        columnOptions={TAX_ZONE_EXPORT_COLUMNS}
        selectedIds={exportSelection?.ids ?? []}
        onExport={exportTaxZones}
        onComplete={() => {
          exportSelection?.onComplete?.()
          setExportSelection(null)
        }}
      />

      <TaxZonesMultiDeleteDialog
        key="tax-zones-delete-many"
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
          <TaxZonesViewDialog
            key={`tax-zone-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            taxZone={currentRow}
            onViewMap={() => setOpen("viewMap")}
          />

          {currentRow.latitude && currentRow.longitude ? (
            <TaxZoneMapDialog
              key={`tax-zone-map-${currentRow.id}`}
              open={open === "viewMap"}
              onOpenChange={(val) => {
                if (!val) {
                  setOpen(null)
                  setTimeout(() => {
                    setCurrentRow(null)
                  }, 500)
                }
              }}
              latitude={Number(currentRow.latitude)}
              longitude={Number(currentRow.longitude)}
              radiusKm={
                currentRow.radius_km ? Number(currentRow.radius_km) : null
              }
              title={`Map: ${currentRow.name}`}
            />
          ) : null}

          <TaxZonesFormDialog
            key={`tax-zone-update-${currentRow.id}`}
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
                <ResponsiveDialogTitle>Delete tax zone?</ResponsiveDialogTitle>
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