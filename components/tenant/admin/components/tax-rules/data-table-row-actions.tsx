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
import { type TaxRule } from "@/types/tenant/tax-rule"
import { useToggleTaxRuleActive } from "@/hooks/tenant/use-tax-rule-query"
import { useTaxRules } from "./tax-rules-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const taxRule = row.original as TaxRule
  const { setOpen, setCurrentRow } = useTaxRules()
  const toggleActive = useToggleTaxRuleActive()

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
              setCurrentRow(taxRule)
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
              setCurrentRow(taxRule)
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
              toggleActive.mutate(taxRule.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_active
                      ? "Tax rule is now active"
                      : "Tax rule is now inactive"
                  )
                },
                onError: (error) => {
                  toast.error(error.message || "Failed to update status")
                },
              })
            }}
          >
            {taxRule.is_active ? (
              <ToggleRight className="mr-2 h-4 w-4" />
            ) : (
              <ToggleLeft className="mr-2 h-4 w-4" />
            )}
            {taxRule.is_active ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="tax.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(taxRule)
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
