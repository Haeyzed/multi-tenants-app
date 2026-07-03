"use client"

import { CustomersProvider } from "@/components/tenant/admin/components/customers/customers-provider"
import { CustomersPrimaryButtons } from "@/components/tenant/admin/components/customers/customers-primary-buttons"
import { CustomersTable } from "@/components/tenant/admin/components/customers/customers-table"
import { CustomersDialogs } from "@/components/tenant/admin/components/customers/customers-dialogs"
import { CustomerStatistics } from "@/components/tenant/admin/components/customers/customer-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function CustomersPage() {
  return (
    <TenantAdminAuthGuard permissions="customers.view">
      <CustomersProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Customers"
            description="Manage your store customers and their profiles."
          >
            <CustomersPrimaryButtons />
          </PageHeader>
          <CustomerStatistics />
          <CustomersTable />
          <CustomersDialogs />
        </div>
      </CustomersProvider>
    </TenantAdminAuthGuard>
  )
}
