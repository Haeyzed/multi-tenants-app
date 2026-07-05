"use client"

import { SuppliersProvider } from "@/components/tenant/admin/components/suppliers/suppliers-provider"
import { SuppliersPrimaryButtons } from "@/components/tenant/admin/components/suppliers/suppliers-primary-buttons"
import { SuppliersTable } from "@/components/tenant/admin/components/suppliers/suppliers-table"
import { SuppliersDialogs } from "@/components/tenant/admin/components/suppliers/suppliers-dialogs"
import { SupplierStatistics } from "@/components/tenant/admin/components/suppliers/supplier-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function SuppliersPage() {
  return (
    <TenantAdminAuthGuard permissions="suppliers.view">
      <SuppliersProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Suppliers"
            description="Manage product suppliers for your store catalog."
          >
            <SuppliersPrimaryButtons />
          </PageHeader>
          <SupplierStatistics />
          <SuppliersTable />
          <SuppliersDialogs />
        </div>
      </SuppliersProvider>
    </TenantAdminAuthGuard>
  )
}
