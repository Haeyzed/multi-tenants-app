import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import { Edit, Eye, EyeOff, MoreHorizontal, Star, Trash2 } from "lucide-react"
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
import { type Category } from "@/types/tenant/category"
import {
  useToggleCategoryFeatured,
  useToggleCategoryVisibility,
} from "@/hooks/tenant/use-category-query"
import { useCategories } from "./categories-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const category = row.original as Category
  const { setOpen, setCurrentRow } = useCategories()
  const toggleVisibility = useToggleCategoryVisibility()
  const toggleFeatured = useToggleCategoryFeatured()

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
        <TenantAdminAuthGuard permissions="categories.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(category)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="categories.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(category)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="categories.update">
          <DropdownMenuItem
            onClick={() => {
              toggleVisibility.mutate(category.id, {
                onSuccess: (result) => {
                  toastApiSuccess(
                    result.message,
                    result.data.is_visible
                      ? "Category is now visible"
                      : "Category is now hidden"
                  )
                },
                onError: (error) =>
                  toastApiError(error, "Failed to update visibility"),
              })
            }}
          >
            {category.is_visible ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {category.is_visible ? "Hide" : "Show"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toggleFeatured.mutate(category.id, {
                onSuccess: (result) => {
                  toastApiSuccess(
                    result.message,
                    result.data.is_featured
                      ? "Category marked as featured"
                      : "Category removed from featured"
                  )
                },
                onError: (error) =>
                  toastApiError(error, "Failed to update featured status"),
              })
            }}
          >
            <Star className="mr-2 h-4 w-4" />
            {category.is_featured ? "Unfeature" : "Feature"}
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="categories.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(category)
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
