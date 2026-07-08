import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import {
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Star,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react"
import { type Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"
import { type TaxZone } from "@/types/tenant/tax-zone"
import {
  useSetDefaultTaxZone,
  useToggleTaxZoneActive,
} from "@/hooks/tenant/use-tax-zone-query"
import { useTaxZones } from "./tax-zones-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const taxZone = row.original as TaxZone
  const { setOpen, setCurrentRow } = useTaxZones()
  const toggleActive = useToggleTaxZoneActive()
  const setDefault = useSetDefaultTaxZone()

  const hasMapCoordinates =
    taxZone.latitude &&
    taxZone.longitude &&
    !Number.isNaN(Number(taxZone.latitude)) &&
    !Number.isNaN(Number(taxZone.longitude))

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        <TenantAdminAuthGuard permissions="tax.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(taxZone)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          {hasMapCoordinates ? (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(taxZone)
                setOpen("viewMap")
              }}
            >
              <MapPin className="mr-2 h-4 w-4" />
              View Map
            </DropdownMenuItem>
          ) : null}
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="tax.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(taxZone)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="tax.update">
          <DropdownMenuItem
            onClick={() => {
              toggleActive.mutate(taxZone.id, {
                onSuccess: (result) => {
                  toastApiSuccess(
                    result.message,
                    result.data.is_active
                      ? "Tax zone is now active"
                      : "Tax zone is now inactive"
                  )
                },
                onError: (error) =>
                  toastApiError(error, "Failed to update status"),
              })
            }}
          >
            {taxZone.is_active ? (
              <ToggleRight className="mr-2 h-4 w-4" />
            ) : (
              <ToggleLeft className="mr-2 h-4 w-4" />
            )}
            {taxZone.is_active ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          {!taxZone.is_default ? (
            <DropdownMenuItem
              onClick={() => {
                setDefault.mutate(taxZone.id, {
                  onSuccess: (result) => {
                    toastApiSuccess(result.message, "Default tax zone updated")
                  },
                  onError: (error) =>
                    toastApiError(error, "Failed to set default"),
                })
              }}
            >
              <Star className="mr-2 h-4 w-4" />
              Set as default
            </DropdownMenuItem>
          ) : null}
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="tax.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(taxZone)
              setOpen("delete")
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
