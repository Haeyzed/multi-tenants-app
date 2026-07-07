import {
  Edit,
  Eye,
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
import { type TaxClass } from "@/types/tenant/tax-class"
import {
  useSetDefaultTaxClass,
  useToggleTaxClassActive,
} from "@/hooks/tenant/use-tax-class-query"
import { useTaxClasses } from "./tax-classes-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const taxClass = row.original as TaxClass
  const { setOpen, setCurrentRow } = useTaxClasses()
  const toggleActive = useToggleTaxClassActive()
  const setDefault = useSetDefaultTaxClass()

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
              setCurrentRow(taxClass)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="tax.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(taxClass)
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
              toggleActive.mutate(taxClass.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_active
                      ? "Tax class is now active"
                      : "Tax class is now inactive"
                  )
                },
                onError: (error) => {
                  toast.error(error.message || "Failed to update status")
                },
              })
            }}
          >
            {taxClass.is_active ? (
              <ToggleRight className="mr-2 h-4 w-4" />
            ) : (
              <ToggleLeft className="mr-2 h-4 w-4" />
            )}
            {taxClass.is_active ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          {!taxClass.is_default ? (
            <DropdownMenuItem
              onClick={() => {
                setDefault.mutate(taxClass.id, {
                  onSuccess: () => {
                    toast.success("Default tax class updated")
                  },
                  onError: (error) => {
                    toast.error(error.message || "Failed to set default")
                  },
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
              setCurrentRow(taxClass)
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
