"use client"

import { ProductForm } from "@/components/tenant/admin/components/products/product-form"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function NewProductPage() {
  return (
    <TenantAdminAuthGuard permissions="products.create">
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <ProductForm />
      </div>
    </TenantAdminAuthGuard>
  )
}
