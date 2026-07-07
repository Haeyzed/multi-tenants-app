"use client"

import { ProductLabelsProvider } from "@/components/tenant/admin/components/product-labels/product-labels-provider"
import { ProductLabelsPrimaryButtons } from "@/components/tenant/admin/components/product-labels/product-labels-primary-buttons"
import { ProductLabelsTable } from "@/components/tenant/admin/components/product-labels/product-labels-table"
import { ProductLabelsDialogs } from "@/components/tenant/admin/components/product-labels/product-labels-dialogs"
import { ProductLabelStatistics } from "@/components/tenant/admin/components/product-labels/product-label-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function ProductLabelsPage() {
  return (
    <TenantAdminAuthGuard permissions="product-labels.view">
      <ProductLabelsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Product Labels"
            description="Manage storefront badges and labels for your products."
          >
            <ProductLabelsPrimaryButtons />
          </PageHeader>
          <ProductLabelStatistics />
          <ProductLabelsTable />
          <ProductLabelsDialogs />
        </div>
      </ProductLabelsProvider>
    </TenantAdminAuthGuard>
  )
}
