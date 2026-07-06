"use client"

import { CollectionsProvider } from "@/components/tenant/admin/components/collections/collections-provider"
import { CollectionsPrimaryButtons } from "@/components/tenant/admin/components/collections/collections-primary-buttons"
import { CollectionsTable } from "@/components/tenant/admin/components/collections/collections-table"
import { CollectionsDialogs } from "@/components/tenant/admin/components/collections/collections-dialogs"
import { CollectionStatistics } from "@/components/tenant/admin/components/collections/collection-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function CollectionsPage() {
  return (
    <TenantAdminAuthGuard permissions="collections.view">
      <CollectionsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Collections"
            description="Manage product collections for your store catalog."
          >
            <CollectionsPrimaryButtons />
          </PageHeader>
          <CollectionStatistics />
          <CollectionsTable />
          <CollectionsDialogs />
        </div>
      </CollectionsProvider>
    </TenantAdminAuthGuard>
  )
}
