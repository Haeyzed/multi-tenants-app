"use client"

import { BrandsProvider } from "@/components/tenant/admin/components/brands/brands-provider"
import { BrandsPrimaryButtons } from "@/components/tenant/admin/components/brands/brands-primary-buttons"
import { BrandsTable } from "@/components/tenant/admin/components/brands/brands-table"
import { BrandsDialogs } from "@/components/tenant/admin/components/brands/brands-dialogs"
import { BrandStatistics } from "@/components/tenant/admin/components/brands/brand-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function BrandsPage() {
  return (
    <TenantAdminAuthGuard permissions="brands.view">
      <BrandsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Brands"
            description="Manage product brands for your store catalog."
          >
            <BrandsPrimaryButtons />
          </PageHeader>
          <BrandStatistics />
          <BrandsTable />
          <BrandsDialogs />
        </div>
      </BrandsProvider>
    </TenantAdminAuthGuard>
  )
}
