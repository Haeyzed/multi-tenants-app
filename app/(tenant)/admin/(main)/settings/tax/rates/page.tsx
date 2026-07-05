"use client"

import { TaxRatesProvider } from "@/components/tenant/admin/components/tax-rates/tax-rates-provider"
import { TaxRatesPrimaryButtons } from "@/components/tenant/admin/components/tax-rates/tax-rates-primary-buttons"
import { TaxRatesTable } from "@/components/tenant/admin/components/tax-rates/tax-rates-table"
import { TaxRatesDialogs } from "@/components/tenant/admin/components/tax-rates/tax-rates-dialogs"
import { TaxRateStatistics } from "@/components/tenant/admin/components/tax-rates/tax-rate-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function TaxRatesPage() {
  return (
    <TenantAdminAuthGuard permissions="tax.view">
      <TaxRatesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Tax Rates"
            description="Manage tax rates applied to class and zone combinations."
          >
            <TaxRatesPrimaryButtons />
          </PageHeader>
          <TaxRateStatistics />
          <TaxRatesTable />
          <TaxRatesDialogs />
        </div>
      </TaxRatesProvider>
    </TenantAdminAuthGuard>
  )
}
