"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
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
import {
  useDeleteTenant,
  useActivateTenant,
  useSuspendTenant
} from "@/hooks/central/use-tenant-query"
import { TenantsMutateDialog } from "./tenants-mutate-dialog"
import { exportTenants } from "@/lib/services/central/tenant-service"
import { ModuleExportDialog } from "@/components/central/components/shared/module-export-dialog"
import { TenantsImportDialog } from "./tenants-import-dialog"
import { TenantsViewDialog } from "./tenants-view-dialog"
import { TenantsDomainDialog } from "./tenants-domain-dialog"
import { TenantsMultiDeleteDialog } from "./tenants-multi-delete-dialog"
import { useTenants } from "./tenants-provider"

export function TenantsDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    exportSelection,
    setExportSelection,
    deleteManySelection,
    setDeleteManySelection,
  } = useTenants()

  const deleteTenant = useDeleteTenant()
  const activateTenant = useActivateTenant()
  const suspendTenant = useSuspendTenant()

  const [isMutating, setIsMutating] = React.useState(false)

  const handleClose = React.useCallback(() => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 500)
  }, [setOpen, setCurrentRow])

  const handleAction = React.useCallback(
    (action: "delete" | "activate" | "suspend") => {
      if (!currentRow) return
      setIsMutating(true)

      const mutation =
        action === "delete" ? deleteTenant :
          action === "activate" ? activateTenant : suspendTenant

      const pastTense =
        action === "delete" ? "deleted" :
          action === "activate" ? "activated" : "suspended"

      mutation.mutate(currentRow.id, {
        onSuccess: () => {
          toast.success(`Tenant "${currentRow.name}" ${pastTense} successfully`)
          setIsMutating(false)
          handleClose()
        },
        onError: (error) => {
          toast.error(error.message || `Failed to ${action} tenant`)
          setIsMutating(false)
        },
      })
    },
    [currentRow, deleteTenant, activateTenant, suspendTenant, handleClose]
  )

  return (
    <>
      <TenantsMutateDialog
        key="tenant-create"
        open={open === "create"}
        onOpenChange={(val) => { if (!val) setOpen(null) }}
      />

      <TenantsImportDialog
        key="tenants-import"
        open={open === "import"}
        onOpenChange={(val) => { if (!val) setOpen(null) }}
      />

      <ModuleExportDialog
        key="tenants-export"
        open={open === "export"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setExportSelection(null)
          }
        }}
        resourceLabel="Tenants"
        selectedIds={exportSelection?.ids ?? []}
        onExport={exportTenants}
        onComplete={() => {
          exportSelection?.onComplete?.()
          setExportSelection(null)
        }}
      />

      <TenantsMultiDeleteDialog
        key="tenants-delete-many"
        open={open === "deleteMany"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setDeleteManySelection(null)
          }
        }}
        ids={(deleteManySelection?.ids ?? []) as string[]}
        onComplete={() => {
          deleteManySelection?.onComplete?.()
          setDeleteManySelection(null)
        }}
      />

      {currentRow && (
        <>
          <TenantsViewDialog
            open={open === "view"}
            onOpenChange={(val) => { if (!val) handleClose() }}
            tenant={currentRow}
          />

          <TenantsDomainDialog
            open={open === "add-domain"}
            onOpenChange={(val) => { if (!val) handleClose() }}
            tenant={currentRow}
          />

          <TenantsMutateDialog
            key={`tenant-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => { if (!val) handleClose() }}
            currentRow={currentRow}
          />

          {/* Delete Confirmation */}
          <ResponsiveDialog open={open === "delete"} onOpenChange={(val) => { if (!val) handleClose() }}>
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Delete tenant?</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  You are about to delete tenant <strong>{currentRow.name}</strong>. This action cannot be undone.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose render={<Button variant="outline">Cancel</Button>} />
                <Button variant="destructive" onClick={() => handleAction("delete")} disabled={isMutating}>
                  {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>

          {/* Activate Confirmation */}
          <ResponsiveDialog open={open === "activate"} onOpenChange={(val) => { if (!val) handleClose() }}>
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Activate tenant?</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  You are about to activate tenant <strong>{currentRow.name}</strong>. They will regain access to their workspace.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose render={<Button variant="outline">Cancel</Button>} />
                <Button onClick={() => handleAction("activate")} disabled={isMutating}>
                  {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Activate
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>

          {/* Suspend Confirmation */}
          <ResponsiveDialog open={open === "suspend"} onOpenChange={(val) => { if (!val) handleClose() }}>
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Suspend tenant?</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  You are about to suspend tenant <strong>{currentRow.name}</strong>. They will immediately lose access to their workspace.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose render={<Button variant="outline">Cancel</Button>} />
                <Button variant="destructive" onClick={() => handleAction("suspend")} disabled={isMutating}>
                  {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Suspend
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </>
      )}
    </>
  )
}