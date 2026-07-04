"use client"

import { TenantsProvider } from "@/components/central/components/tenants/tenants-provider"
import { TenantsPrimaryButtons } from "@/components/central/components/tenants/tenants-primary-buttons"
import { TenantsTable } from "@/components/central/components/tenants/tenants-table"
import { TenantsDialogs } from "@/components/central/components/tenants/tenants-dialogs"
import { TenantStatistics } from "@/components/central/components/tenants/tenant-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { Guard } from "@/components/central/components/auth/guard"

export default function TenantsPage() {
  return (
    <Guard permissions="tenants.view">
      <TenantsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Tenants"
            description="Manage and monitor all tenants across your platform."
          >
            <TenantsPrimaryButtons />
          </PageHeader>
          <TenantStatistics />
          <TenantsTable />
          <TenantsDialogs />
        </div>
      </TenantsProvider>
    </Guard>
  )
}
