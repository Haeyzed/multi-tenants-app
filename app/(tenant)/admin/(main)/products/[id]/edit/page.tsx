"use client"

import { use } from "react"
import { Spinner } from "@/components/ui/spinner"
import { ProductForm } from "@/components/tenant/admin/components/products/product-form"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"
import { useGetProduct } from "@/hooks/tenant/use-product-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"

type EditProductPageProps = {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params)
  const productId = Number(id)
  const { data: product, isLoading, error } = useGetProduct(productId)

  useQueryErrorToast(error, "Failed to load product.")

  return (
    <TenantAdminAuthGuard permissions="products.update">
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        {isLoading || !product ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ProductForm product={product} />
        )}
      </div>
    </TenantAdminAuthGuard>
  )
}
