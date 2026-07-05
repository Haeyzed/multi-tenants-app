"use client"

import { WarehousesProvider } from "@/components/tenant/admin/components/warehouses/warehouses-provider"
import { WarehousesPrimaryButtons } from "@/components/tenant/admin/components/warehouses/warehouses-primary-buttons"
import { WarehousesTable } from "@/components/tenant/admin/components/warehouses/warehouses-table"
import { WarehousesDialogs } from "@/components/tenant/admin/components/warehouses/warehouses-dialogs"
import { WarehouseStatistics } from "@/components/tenant/admin/components/warehouses/warehouse-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function WarehousesPage() {
  return (
    <TenantAdminAuthGuard permissions="warehouses.view">
      <WarehousesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Warehouses"
            description="Manage warehouses, zones, and storage locations for your store."
          >
            <WarehousesPrimaryButtons />
          </PageHeader>
          <WarehouseStatistics />
          <WarehousesTable />
          <WarehousesDialogs />
        </div>
      </WarehousesProvider>
    </TenantAdminAuthGuard>
  )
}
