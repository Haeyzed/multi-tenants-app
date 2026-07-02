"use client"

import { CategoriesProvider } from "@/components/tenant/admin/components/categories/categories-provider"
import { CategoriesPrimaryButtons } from "@/components/tenant/admin/components/categories/categories-primary-buttons"
import { CategoriesTable } from "@/components/tenant/admin/components/categories/categories-table"
import { CategoriesDialogs } from "@/components/tenant/admin/components/categories/categories-dialogs"
import { CategoryStatistics } from "@/components/tenant/admin/components/categories/category-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function CategoriesPage() {
  return (
    <TenantAdminAuthGuard permissions="categories.view">
      <CategoriesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Categories"
            description="Organize your product catalog with categories."
          >
            <CategoriesPrimaryButtons />
          </PageHeader>
          <CategoryStatistics />
          <CategoriesTable />
          <CategoriesDialogs />
        </div>
      </CategoriesProvider>
    </TenantAdminAuthGuard>
  )
}
