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
import { useDeleteWarehouse } from "@/hooks/tenant/use-warehouse-query"
import { exportWarehouses } from "@/lib/services/tenant/warehouse-service"
import { WAREHOUSE_EXPORT_COLUMNS } from "@/lib/export-columns"
import { TenantModuleExportDialog } from "@/components/tenant/admin/components/shared/tenant-module-export-dialog"
import { WarehousesFormDialog } from "./warehouses-form-dialog"
import { WarehousesViewDialog } from "./warehouses-view-dialog"
import { WarehouseMapDialog } from "./warehouse-map-dialog"
import { WarehousesImportDialog } from "./warehouses-import-dialog"
import { WarehousesMultiDeleteDialog } from "./warehouses-multi-delete-dialog"
import { WarehousesManageZonesDialog } from "./warehouses-manage-zones-dialog"
import { WarehousesManageLocationsDialog } from "./warehouses-manage-locations-dialog"
import { useWarehouses } from "./warehouses-provider"

export function WarehousesDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    exportSelection,
    setExportSelection,
    deleteManySelection,
    setDeleteManySelection,
  } = useWarehouses()
  const deleteWarehouse = useDeleteWarehouse()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = React.useCallback(() => {
    if (!currentRow) return
    setIsDeleting(true)
    deleteWarehouse.mutate(currentRow.id, {
      onSuccess: () => {
        toast.success(`Warehouse "${currentRow.name}" deleted successfully`)
        setIsDeleting(false)
        setOpen(null)
        setTimeout(() => {
          setCurrentRow(null)
        }, 500)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete warehouse")
        setIsDeleting(false)
      },
    })
  }, [currentRow, deleteWarehouse, setOpen, setCurrentRow])

  return (
    <>
      <WarehousesFormDialog
        key="warehouse-create"
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <WarehousesImportDialog
        key="warehouses-import"
        open={open === "import"}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      />

      <TenantModuleExportDialog
        key="warehouses-export"
        open={open === "export"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setExportSelection(null)
          }
        }}
        resourceLabel="Warehouses"
        columnOptions={WAREHOUSE_EXPORT_COLUMNS}
        selectedIds={exportSelection?.ids ?? []}
        onExport={exportWarehouses}
        onComplete={() => {
          exportSelection?.onComplete?.()
          setExportSelection(null)
        }}
      />

      <WarehousesMultiDeleteDialog
        key="warehouses-delete-many"
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
          <WarehousesViewDialog
            key={`warehouse-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            warehouse={currentRow}
            onViewMap={() => setOpen("viewMap")}
          />

          {currentRow.latitude !== null &&
          currentRow.longitude !== null &&
          !Number.isNaN(Number(currentRow.latitude)) &&
          !Number.isNaN(Number(currentRow.longitude)) ? (
            <WarehouseMapDialog
              key={`warehouse-map-${currentRow.id}`}
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
              title={`Map: ${currentRow.name}`}
            />
          ) : null}

          <WarehousesFormDialog
            key={`warehouse-update-${currentRow.id}`}
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

          <WarehousesManageZonesDialog
            key={`warehouse-zones-${currentRow.id}`}
            open={open === "manageZones"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            warehouse={currentRow}
          />

          <WarehousesManageLocationsDialog
            key={`warehouse-locations-${currentRow.id}`}
            open={open === "manageLocations"}
            onOpenChange={(val) => {
              if (!val) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            warehouse={currentRow}
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
                <ResponsiveDialogTitle>Delete warehouse?</ResponsiveDialogTitle>
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
