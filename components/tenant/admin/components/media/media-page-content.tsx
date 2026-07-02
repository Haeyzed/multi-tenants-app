"use client"

import { MediaLibraryPanel } from "@/components/tenant/admin/components/media/media-library-panel"
import { MediaStatistics } from "@/components/tenant/admin/components/media/media-statistics"
import { PageHeader } from "@/components/layout/page-header"

export function MediaPageContent() {
  return (
    <>
      <PageHeader
        title="Media library"
        description="Upload, organize, move, and copy files across folders."
      />

      <MediaStatistics />

      <MediaLibraryPanel mode="manage" />
    </>
  )
}
