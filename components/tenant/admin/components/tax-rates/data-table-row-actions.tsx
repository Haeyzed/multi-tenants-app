import { Edit, Eye, MoreHorizontal, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
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
import { type TaxRate } from "@/types/tenant/tax-rate"
import { useToggleTaxRateActive } from "@/hooks/tenant/use-tax-rate-query"
import { useTaxRates } from "./tax-rates-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const taxRate = row.original as TaxRate
  const { setOpen, setCurrentRow } = useTaxRates()
  const toggleActive = useToggleTaxRateActive()

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
              setCurrentRow(taxRate)
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
              setCurrentRow(taxRate)
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
              toggleActive.mutate(taxRate.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_active
                      ? "Tax rate is now active"
                      : "Tax rate is now inactive"
                  )
                },
                onError: (error) => {
                  toast.error(error.message || "Failed to update status")
                },
              })
            }}
          >
            {taxRate.is_active ? (
              <ToggleRight className="mr-2 h-4 w-4" />
            ) : (
              <ToggleLeft className="mr-2 h-4 w-4" />
            )}
            {taxRate.is_active ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="tax.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(taxRate)
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
