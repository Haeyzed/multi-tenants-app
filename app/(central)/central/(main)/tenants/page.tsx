"use client"

import { TenantsProvider } from "@/components/central/components/tenants/tenants-provider"
import { TenantsPrimaryButtons } from "@/components/central/components/tenants/tenants-primary-buttons"
import { TenantsTable } from "@/components/central/components/tenants/tenants-table"
import { TenantsDialogs } from "@/components/central/components/tenants/tenants-dialogs"
import { TenantStatistics } from "@/components/central/components/tenants/tenant-statistics"

export default function TenantsPage() {
  return (
    <TenantsProvider>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Tenants</h1>
          <TenantsPrimaryButtons />
        </div>
        <TenantStatistics />
        <TenantsTable />
        <TenantsDialogs />
      </div>
    </TenantsProvider>
  )
}
