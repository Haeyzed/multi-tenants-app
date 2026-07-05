import {
  CreditCard,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Users,
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
import { type Supplier } from "@/types/tenant/supplier"
import { useToggleSupplierActive } from "@/hooks/tenant/use-supplier-query"
import { useSuppliers } from "./suppliers-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const supplier = row.original as Supplier
  const { setOpen, setCurrentRow } = useSuppliers()
  const toggleActive = useToggleSupplierActive()

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
        <TenantAdminAuthGuard permissions="suppliers.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(supplier)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="suppliers.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(supplier)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(supplier)
              setOpen("manageContacts")
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            Manage Contacts
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(supplier)
              setOpen("manageAddresses")
            }}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Manage Addresses
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(supplier)
              setOpen("manageBankAccounts")
            }}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Bank Accounts
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toggleActive.mutate(supplier.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_active
                      ? "Supplier is now active"
                      : "Supplier is now inactive"
                  )
                },
                onError: (error) => {
                  toast.error(error.message || "Failed to update status")
                },
              })
            }}
          >
            {supplier.is_active ? (
              <ToggleRight className="mr-2 h-4 w-4" />
            ) : (
              <ToggleLeft className="mr-2 h-4 w-4" />
            )}
            {supplier.is_active ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="suppliers.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(supplier)
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
