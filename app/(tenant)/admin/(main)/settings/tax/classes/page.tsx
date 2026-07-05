"use client"

import { TaxClassesProvider } from "@/components/tenant/admin/components/tax-classes/tax-classes-provider"
import { TaxClassesPrimaryButtons } from "@/components/tenant/admin/components/tax-classes/tax-classes-primary-buttons"
import { TaxClassesTable } from "@/components/tenant/admin/components/tax-classes/tax-classes-table"
import { TaxClassesDialogs } from "@/components/tenant/admin/components/tax-classes/tax-classes-dialogs"
import { TaxClassStatistics } from "@/components/tenant/admin/components/tax-classes/tax-class-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function TaxClassesPage() {
  return (
    <TenantAdminAuthGuard permissions="tax.view">
      <TaxClassesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Tax Classes"
            description="Manage tax classifications applied to products in your store."
          >
            <TaxClassesPrimaryButtons />
          </PageHeader>
          <TaxClassStatistics />
          <TaxClassesTable />
          <TaxClassesDialogs />
        </div>
      </TaxClassesProvider>
    </TenantAdminAuthGuard>
  )
}
