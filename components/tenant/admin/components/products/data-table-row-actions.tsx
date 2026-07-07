import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Copy,
  Edit,
  Eye,
  HelpCircle,
  MessageSquareReply,
  MoreHorizontal,
  Star,
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
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"
import { useDuplicateProduct } from "@/hooks/tenant/use-product-nested-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import { type Product } from "@/types/tenant/product"
import { useProducts } from "./products-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const product = row.original as Product
  const { setOpen, setCurrentRow } = useProducts()
  const duplicateProduct = useDuplicateProduct()

  const handleDuplicate = () => {
    duplicateProduct.mutate(product.id, {
      onSuccess: (response) => {
        toastApiSuccess(response.message, "Product duplicated")
        router.push(`/admin/products/${response.data.id}/edit`)
      },
      onError: (error) => toastApiError(error, "Failed to duplicate product"),
    })
  }

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
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(product)
            setOpen("view")
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <TenantAdminAuthGuard permissions="products.update">
          <DropdownMenuItem
            render={<Link href={`/admin/products/${product.id}/edit`} />}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(product)
              setOpen("manageFaqs")
            }}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Manage FAQs
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(product)
              setOpen("manageReviews")
            }}
          >
            <Star className="mr-2 h-4 w-4" />
            Manage reviews
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(product)
              setOpen("manageQuestions")
            }}
          >
            <MessageSquareReply className="mr-2 h-4 w-4" />
            Manage questions
          </DropdownMenuItem>
        </TenantAdminAuthGuard>
        <DropdownMenuSeparator />
        <TenantAdminAuthGuard permissions="products.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(product)
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
