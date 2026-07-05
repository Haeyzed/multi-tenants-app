"use client"

import { TaxZonesProvider } from "@/components/tenant/admin/components/tax-zones/tax-zones-provider"
import { TaxZonesPrimaryButtons } from "@/components/tenant/admin/components/tax-zones/tax-zones-primary-buttons"
import { TaxZonesTable } from "@/components/tenant/admin/components/tax-zones/tax-zones-table"
import { TaxZonesDialogs } from "@/components/tenant/admin/components/tax-zones/tax-zones-dialogs"
import { TaxZoneStatistics } from "@/components/tenant/admin/components/tax-zones/tax-zone-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function TaxZonesPage() {
  return (
    <TenantAdminAuthGuard permissions="tax.view">
      <TaxZonesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Tax Zones"
            description="Manage geographic zones where tax rates apply in your store."
          >
            <TaxZonesPrimaryButtons />
          </PageHeader>
          <TaxZoneStatistics />
          <TaxZonesTable />
          <TaxZonesDialogs />
        </div>
      </TaxZonesProvider>
    </TenantAdminAuthGuard>
  )
}
