"use client"

import { MediaPageContent } from "@/components/tenant/admin/components/media/media-page-content"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"

export default function MediaPage() {
  return (
    <TenantAdminAuthGuard permissions="settings.view">
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <MediaPageContent />
      </div>
    </TenantAdminAuthGuard>
  )
}
