"use client"

import { ProductsProvider } from "@/components/tenant/admin/components/products/products-provider"
import { ProductsPrimaryButtons } from "@/components/tenant/admin/components/products/products-primary-buttons"
import { ProductsTable } from "@/components/tenant/admin/components/products/products-table"
import { ProductsDialogs } from "@/components/tenant/admin/components/products/products-dialogs"
import { ProductStatistics } from "@/components/tenant/admin/components/products/product-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function ProductsPage() {
  return (
    <TenantAdminAuthGuard permissions="products.view">
      <ProductsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Products"
            description="Manage your catalog, inventory, pricing, and product media."
          >
            <ProductsPrimaryButtons />
          </PageHeader>
          <ProductStatistics />
          <ProductsTable />
          <ProductsDialogs />
        </div>
      </ProductsProvider>
    </TenantAdminAuthGuard>
  )
}
