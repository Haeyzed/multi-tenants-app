"use client"

import { InventoryPanel } from "@/components/tenant/admin/components/inventory/inventory-panel"
import { InventoryStatistics } from "@/components/tenant/admin/components/inventory/inventory-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function InventoryPage() {
  return (
    <TenantAdminAuthGuard permissions="inventory.view">
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <PageHeader
          title="Inventory"
          description="Monitor stock levels, movements, and customer back-in-stock requests."
        />
        <InventoryStatistics />
        <InventoryPanel />
      </div>
    </TenantAdminAuthGuard>
  )
}
