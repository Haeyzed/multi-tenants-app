import { MoreHorizontal, Trash2 } from "lucide-react"
import { type Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Guard } from "@/components/central/components/auth/guard"
import { type Tenant } from "@/types/central/tenant"
import { useTenants } from "./tenants-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
                                             row,
                                           }: DataTableRowActionsProps<TData>) {
  const tenant = row.original as Tenant
  const { setOpen, setCurrentRow } = useTenants()

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
        <Guard permissions="tenants.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(tenant)
              setOpen("update")
            }}
          >
            Edit
          </DropdownMenuItem>
        </Guard>
        <DropdownMenuSeparator />
        <Guard permissions="tenants.delete">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(tenant)
              setOpen("delete")
            }}
          >
            Delete
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </Guard>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
