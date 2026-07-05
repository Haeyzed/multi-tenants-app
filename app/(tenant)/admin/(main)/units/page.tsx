"use client"

import { UnitsProvider } from "@/components/tenant/admin/components/units/units-provider"
import { UnitsPrimaryButtons } from "@/components/tenant/admin/components/units/units-primary-buttons"
import { UnitsTable } from "@/components/tenant/admin/components/units/units-table"
import { UnitsDialogs } from "@/components/tenant/admin/components/units/units-dialogs"
import { UnitStatistics } from "@/components/tenant/admin/components/units/unit-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function UnitsPage() {
  return (
    <TenantAdminAuthGuard permissions="units.view">
      <UnitsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Units"
            description="Manage measurement units for weight, length, volume, and more."
          >
            <UnitsPrimaryButtons />
          </PageHeader>
          <UnitStatistics />
          <UnitsTable />
          <UnitsDialogs />
        </div>
      </UnitsProvider>
    </TenantAdminAuthGuard>
  )
}
