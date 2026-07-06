"use client"

import { AttributeSetsProvider } from "@/components/tenant/admin/components/attribute-sets/attribute-sets-provider"
import { AttributeSetsPrimaryButtons } from "@/components/tenant/admin/components/attribute-sets/attribute-sets-primary-buttons"
import { AttributeSetsTable } from "@/components/tenant/admin/components/attribute-sets/attribute-sets-table"
import { AttributeSetsDialogs } from "@/components/tenant/admin/components/attribute-sets/attribute-sets-dialogs"
import { AttributeSetStatistics } from "@/components/tenant/admin/components/attribute-sets/attribute-set-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function AttributeSetsPage() {
  return (
    <TenantAdminAuthGuard permissions="attribute-sets.view">
      <AttributeSetsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Attribute Sets"
            description="Group attributes into sets for categories and products."
          >
            <AttributeSetsPrimaryButtons />
          </PageHeader>
          <AttributeSetStatistics />
          <AttributeSetsTable />
          <AttributeSetsDialogs />
        </div>
      </AttributeSetsProvider>
    </TenantAdminAuthGuard>
  )
}
