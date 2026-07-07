import {
  Edit,
  Eye,
  LayoutGrid,
  MapPin,
  MoreHorizontal,
  Star,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react"
import { type Row } from "@tanstack/react-table"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"
import { type Warehouse } from "@/types/tenant/warehouse"
import {
  useSetWarehousePrimary,
  useToggleWarehouseActive,
} from "@/hooks/tenant/use-warehouse-query"
import { useWarehouses } from "./warehouses-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const warehouse = row.original as Warehouse
  const { setOpen, setCurrentRow } = useWarehouses()
  const toggleActive = useToggleWarehouseActive()
  const setPrimary = useSetWarehousePrimary()

  const hasMapCoordinates =
    warehouse.latitude !== null &&
    warehouse.longitude !== null &&
    !Number.isNaN(Number(warehouse.latitude)) &&
    !Number.isNaN(Number(warehouse.longitude))

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
      <DropdownMenuContent align="end" className="w-52">
        <TenantAdminAuthGuard permissions="warehouses.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(warehouse)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          {hasMapCoordinates ? (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(warehouse)
                setOpen("viewMap")
              }}
            >
              <MapPin className="mr-2 h-4 w-4" />
              View Map
            </DropdownMenuItem>
          ) : null}
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="warehouses.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(warehouse)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(warehouse)
              setOpen("manageZones")
            }}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Manage Zones
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(warehouse)
              setOpen("manageLocations")
            }}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Manage Locations
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toggleActive.mutate(warehouse.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_active
                      ? "Warehouse is now active"
                      : "Warehouse is now inactive"
                  )
                },
                onError: (error) => {
                  toast.error(error.message || "Failed to update status")
                },
              })
            }}
          >
            {warehouse.is_active ? (
              <ToggleRight className="mr-2 h-4 w-4" />
            ) : (
              <ToggleLeft className="mr-2 h-4 w-4" />
            )}
            {warehouse.is_active ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          {!warehouse.is_primary ? (
            <DropdownMenuItem
              onClick={() => {
                setPrimary.mutate(warehouse.id, {
                  onSuccess: () => {
                    toast.success(
                      `"${warehouse.name}" set as primary warehouse`
                    )
                  },
                  onError: (error) => {
                    toast.error(
                      error.message || "Failed to set primary warehouse"
                    )
                  },
                })
              }}
            >
              <Star className="mr-2 h-4 w-4" />
              Set Primary
            </DropdownMenuItem>
          ) : null}
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="warehouses.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(warehouse)
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
