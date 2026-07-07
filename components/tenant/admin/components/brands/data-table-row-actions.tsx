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
import { type Brand } from "@/types/tenant/brand"
import {
  useToggleBrandFeatured,
  useToggleBrandVisibility,
} from "@/hooks/tenant/use-brand-query"
import { useBrands } from "./brands-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const brand = row.original as Brand
  const { setOpen, setCurrentRow } = useBrands()
  const toggleVisibility = useToggleBrandVisibility()
  const toggleFeatured = useToggleBrandFeatured()

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
        <TenantAdminAuthGuard permissions="brands.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(brand)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="brands.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(brand)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="brands.update">
          <DropdownMenuItem
            onClick={() => {
              toggleVisibility.mutate(brand.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_visible
                      ? "Brand is now visible"
                      : "Brand is now hidden"
                  )
                },
                onError: (error) => {
                  toast.error(error.message || "Failed to update visibility")
                },
              })
            }}
          >
            {brand.is_visible ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {brand.is_visible ? "Hide" : "Show"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toggleFeatured.mutate(brand.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_featured
                      ? "Brand marked as featured"
                      : "Brand removed from featured"
                  )
                },
                onError: (error) => {
                  toast.error(
                    error.message || "Failed to update featured status"
                  )
                },
              })
            }}
          >
            <Star className="mr-2 h-4 w-4" />
            {brand.is_featured ? "Unfeature" : "Feature"}
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="brands.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(brand)
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
