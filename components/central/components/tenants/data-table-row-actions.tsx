import {
  Edit,
  Eye,
  Globe,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
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
      <DropdownMenuContent align="end" className="w-48">
        <Guard permissions="tenants.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(tenant)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </Guard>
        <Guard permissions="tenants.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(tenant)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </Guard>
        <Guard permissions="domains.create">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(tenant)
              setOpen("add-domain")
            }}
          >
            <Globe className="mr-2 h-4 w-4" />
            Manage Domains
          </DropdownMenuItem>
        </Guard>
        <DropdownMenuSeparator />
        <Guard permissions="tenants.update">
          {tenant.status === "active" ? (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(tenant)
                setOpen("suspend")
              }}
            >
              <PauseCircle className="mr-2 h-4 w-4" />
              Suspend
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(tenant)
                setOpen("activate")
              }}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Activate
            </DropdownMenuItem>
          )}
        </Guard>
        <DropdownMenuSeparator />
        <Guard permissions="tenants.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(tenant)
              setOpen("delete")
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </Guard>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
