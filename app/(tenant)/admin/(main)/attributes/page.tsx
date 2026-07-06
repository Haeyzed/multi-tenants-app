"use client"

import { AttributesProvider } from "@/components/tenant/admin/components/attributes/attributes-provider"
import { AttributesPrimaryButtons } from "@/components/tenant/admin/components/attributes/attributes-primary-buttons"
import { AttributesTable } from "@/components/tenant/admin/components/attributes/attributes-table"
import { AttributesDialogs } from "@/components/tenant/admin/components/attributes/attributes-dialogs"
import { AttributeStatistics } from "@/components/tenant/admin/components/attributes/attribute-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function AttributesPage() {
  return (
    <TenantAdminAuthGuard permissions="attributes.view">
      <AttributesProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Attributes"
            description="Manage product attributes for your store catalog."
          >
            <AttributesPrimaryButtons />
          </PageHeader>
          <AttributeStatistics />
          <AttributesTable />
          <AttributesDialogs />
        </div>
      </AttributesProvider>
    </TenantAdminAuthGuard>
  )
}
