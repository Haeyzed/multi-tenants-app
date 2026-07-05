import { Edit, Eye, MoreHorizontal, Star, Trash2 } from "lucide-react"
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
import { type Unit } from "@/types/tenant/unit"
import { useSetBaseUnit } from "@/hooks/tenant/use-unit-query"
import { useUnits } from "./units-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const unit = row.original as Unit
  const { setOpen, setCurrentRow } = useUnits()
  const setBase = useSetBaseUnit()

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
        <TenantAdminAuthGuard permissions="units.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(unit)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="units.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(unit)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="units.update">
          {!unit.is_base ? (
            <DropdownMenuItem
              onClick={() => {
                setBase.mutate(unit.id, {
                  onSuccess: () => {
                    toast.success("Base unit updated")
                  },
                  onError: (error) => {
                    toast.error(error.message || "Failed to set base unit")
                  },
                })
              }}
            >
              <Star className="mr-2 h-4 w-4" />
              Set as base
            </DropdownMenuItem>
          ) : null}
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="units.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(unit)
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
