import { Edit, Eye, EyeOff, MoreHorizontal, Star, Trash2 } from "lucide-react"
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
import { type Collection } from "@/types/tenant/collection"
import {
  useToggleCollectionFeatured,
  useToggleCollectionVisibility,
} from "@/hooks/tenant/use-collection-query"
import { useCollections } from "./collections-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const collection = row.original as Collection
  const { setOpen, setCurrentRow } = useCollections()
  const toggleVisibility = useToggleCollectionVisibility()
  const toggleFeatured = useToggleCollectionFeatured()

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
        <TenantAdminAuthGuard permissions="collections.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(collection)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="collections.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(collection)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="collections.update">
          <DropdownMenuItem
            onClick={() => {
              toggleVisibility.mutate(collection.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_visible
                      ? "Collection is now visible"
                      : "Collection is now hidden"
                  )
                },
                onError: (error) => {
                  toast.error(error.message || "Failed to update visibility")
                },
              })
            }}
          >
            {collection.is_visible ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {collection.is_visible ? "Hide" : "Show"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toggleFeatured.mutate(collection.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_featured
                      ? "Collection marked as featured"
                      : "Collection removed from featured"
                  )
                },
                onError: (error) => {
                  toast.error(error.message || "Failed to update featured status")
                },
              })
            }}
          >
            <Star className="mr-2 h-4 w-4" />
            {collection.is_featured ? "Unfeature" : "Feature"}
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="collections.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(collection)
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
