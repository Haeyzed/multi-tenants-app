import {
  Edit,
  Eye,
  Filter,
  Layers,
  List,
  MoreHorizontal,
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
import { type Attribute } from "@/types/tenant/attribute"
import {
  useToggleAttributeFilterable,
  useToggleAttributeVariant,
} from "@/hooks/tenant/use-attribute-query"
import { useAttributes } from "./attributes-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const attribute = row.original as Attribute
  const { setOpen, setCurrentRow } = useAttributes()
  const toggleFilterable = useToggleAttributeFilterable()
  const toggleVariant = useToggleAttributeVariant()

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
        <TenantAdminAuthGuard permissions="attributes.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(attribute)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="attributes.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(attribute)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        {attribute.type === "select" ? (
          <TenantAdminAuthGuard permissions="attributes.update">
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(attribute)
                setOpen("manageValues")
              }}
            >
              <List className="mr-2 h-4 w-4" />
              Manage values
            </DropdownMenuItem>
          </TenantAdminAuthGuard>
        ) : null}
        <TenantAdminAuthGuard permissions="attributes.update">
          <DropdownMenuItem
            onClick={() => {
              toggleFilterable.mutate(attribute.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_filterable
                      ? "Attribute is now filterable"
                      : "Attribute is no longer filterable"
                  )
                },
                onError: (error) => {
                  toast.error(error.message || "Failed to update filterable status")
                },
              })
            }}
          >
            <Filter className="mr-2 h-4 w-4" />
            {attribute.is_filterable ? "Disable filterable" : "Enable filterable"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toggleVariant.mutate(attribute.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_variant
                      ? "Attribute marked as variant"
                      : "Attribute removed from variants"
                  )
                },
                onError: (error) => {
                  toast.error(error.message || "Failed to update variant status")
                },
              })
            }}
          >
            <Layers className="mr-2 h-4 w-4" />
            {attribute.is_variant ? "Disable variant" : "Enable variant"}
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="attributes.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(attribute)
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
