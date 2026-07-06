import { Edit, Eye, Layers, MoreHorizontal, Trash2 } from "lucide-react"
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
import { type AttributeSet } from "@/types/tenant/attribute-set"
import { useAttributeSets } from "./attribute-sets-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const attributeSet = row.original as AttributeSet
  const { setOpen, setCurrentRow } = useAttributeSets()

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
      <DropdownMenuContent align="end" className="w-48">
        <TenantAdminAuthGuard permissions="attribute-sets.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(attributeSet)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="attribute-sets.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(attributeSet)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(attributeSet)
              setOpen("manageAttributes")
            }}
          >
            <Layers className="mr-2 h-4 w-4" />
            Manage Attributes
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="attribute-sets.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(attributeSet)
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
