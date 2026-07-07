import { Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react"
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
import { type Tag } from "@/types/tenant/tag"
import { useToggleTagVisibility } from "@/hooks/tenant/use-tag-query"
import { useTags } from "./tags-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const tag = row.original as Tag
  const { setOpen, setCurrentRow } = useTags()
  const toggleVisibility = useToggleTagVisibility()

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
        <TenantAdminAuthGuard permissions="tags.view">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(tag)
              setOpen("view")
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="tags.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(tag)
              setOpen("update")
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <TenantAdminAuthGuard permissions="tags.update">
          <DropdownMenuItem
            onClick={() => {
              toggleVisibility.mutate(tag.id, {
                onSuccess: (updated) => {
                  toast.success(
                    updated.is_visible
                      ? "Tag is now visible"
                      : "Tag is now hidden"
                  )
                },
                onError: (error) => {
                  toast.error(error.message || "Failed to update visibility")
                },
              })
            }}
          >
            {tag.is_visible ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {tag.is_visible ? "Hide" : "Show"}
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="tags.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(tag)
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
