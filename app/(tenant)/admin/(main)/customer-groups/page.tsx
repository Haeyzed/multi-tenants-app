"use client"

import { CustomerGroupsProvider } from "@/components/tenant/admin/components/customer-groups/customer-groups-provider"
import { CustomerGroupsPrimaryButtons } from "@/components/tenant/admin/components/customer-groups/customer-groups-primary-buttons"
import { CustomerGroupsTable } from "@/components/tenant/admin/components/customer-groups/customer-groups-table"
import { CustomerGroupsDialogs } from "@/components/tenant/admin/components/customer-groups/customer-groups-dialogs"
import { CustomerGroupStatistics } from "@/components/tenant/admin/components/customer-groups/customer-group-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function CustomerGroupsPage() {
  return (
    <TenantAdminAuthGuard permissions="customers.view">
      <CustomerGroupsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Customer Groups"
            description="Segment customers and apply group-level discounts."
          >
            <CustomerGroupsPrimaryButtons />
          </PageHeader>
          <CustomerGroupStatistics />
          <CustomerGroupsTable />
          <CustomerGroupsDialogs />
        </div>
      </CustomerGroupsProvider>
    </TenantAdminAuthGuard>
  )
}
