"use client"

import { TagsProvider } from "@/components/tenant/admin/components/tags/tags-provider"
import { TagsPrimaryButtons } from "@/components/tenant/admin/components/tags/tags-primary-buttons"
import { TagsTable } from "@/components/tenant/admin/components/tags/tags-table"
import { TagsDialogs } from "@/components/tenant/admin/components/tags/tags-dialogs"
import { TagStatistics } from "@/components/tenant/admin/components/tags/tag-statistics"
import { PageHeader } from "@/components/layout/page-header"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function TagsPage() {
  return (
    <TenantAdminAuthGuard permissions="tags.view">
      <TagsProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Tags"
            description="Manage product tags for your store catalog."
          >
            <TagsPrimaryButtons />
          </PageHeader>
          <TagStatistics />
          <TagsTable />
          <TagsDialogs />
        </div>
      </TagsProvider>
    </TenantAdminAuthGuard>
  )
}
