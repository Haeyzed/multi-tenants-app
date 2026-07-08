import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import { Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react"
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
import { type ProductLabel } from "@/types/tenant/product-label"
import { useToggleProductLabelActive } from "@/hooks/tenant/use-product-label-query"
import { useProductLabels } from "./product-labels-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const label = row.original as ProductLabel
  const { setOpen, setCurrentRow } = useProductLabels()
  const toggleActive = useToggleProductLabelActive()

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
      <DropdownMenuContent align="end" className="w-40">
        <TenantAdminAuthGuard permissions="product-labels.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(label)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="product-labels.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(label)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="product-labels.update">
          <DropdownMenuItem
            onClick={() => {
              toggleActive.mutate(label.id, {
                onSuccess: (result) => {
                  toastApiSuccess(
                    result.message,
                    result.data.is_active
                      ? "Product label is now active"
                      : "Product label is now inactive"
                  )
                },
                onError: (error) =>
                  toastApiError(error, "Failed to update status"),
              })
            }}
          >
            {label.is_active ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {label.is_active ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="product-labels.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(label)
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
