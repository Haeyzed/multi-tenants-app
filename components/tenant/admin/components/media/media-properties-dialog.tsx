"use client"

import { formatDistanceToNow, format } from "date-fns"
import { ExternalLinkIcon } from "lucide-react"

import { useGetMedia } from "@/hooks/tenant/use-media-query"
import { getMediaFileExtension, isMediaImage } from "@/lib/tenant/media-file-kind"
import type { MediaItem } from "@/types/tenant/media"
import { MediaFileIcon } from "@/components/tenant/admin/components/shared/media-file-icon"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { Skeleton } from "@/components/ui/skeleton"

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—"

  try {
    const date = new Date(value)
    return `${format(date, "PPpp")} (${formatDistanceToNow(date, { addSuffix: true })})`
  } catch {
    return value
  }
}

function buildFields(item: MediaItem): ModuleViewField[] {
  const extension = getMediaFileExtension(item)
  const uploaderName = item.uploader
    ? [item.uploader.first_name, item.uploader.last_name].filter(Boolean).join(" ") ||
      item.uploader.email
    : null

  const customProperties = (
    item as MediaItem & {
      custom_properties?: Record<string, unknown> | null
    }
  ).custom_properties

  const fields: ModuleViewField[] = [
    {
      label: "Preview",
      value: isMediaImage(item) ? (
        <MediaThumbnail media={item} alt={item.title ?? item.name} size="lg" zoomable />
      ) : (
        <MediaFileIcon item={item} size="lg" />
      ),
      className: "sm:col-span-2",
    },
    { label: "ID", value: String(item.id) },
    { label: "Title", value: item.title ?? "—" },
    { label: "Name", value: item.name },
    { label: "File name", value: item.file_name },
    { label: "Extension", value: extension ? extension.toUpperCase() : "—" },
    { label: "MIME type", value: item.mime_type ?? "—" },
    { label: "Size", value: formatFileSize(item.size) },
    { label: "Folder", value: item.folder?.path ?? item.folder?.name ?? "Library root" },
    { label: "Disk", value: item.disk },
    { label: "Storage path", value: item.path ?? "—", className: "sm:col-span-2" },
    {
      label: "URL",
      value: (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 break-all text-primary hover:underline"
        >
          {item.url}
          <ExternalLinkIcon className="size-3.5 shrink-0" />
        </a>
      ),
      className: "sm:col-span-2",
    },
    { label: "Alt text", value: item.alt_text ?? "—", className: "sm:col-span-2" },
    { label: "Uploaded by", value: uploaderName ?? item.uploaded_by ?? "—" },
    { label: "Uploader email", value: item.uploader?.email ?? "—" },
    { label: "Created", value: formatDate(item.created_at) },
    { label: "Updated", value: formatDate(item.updated_at) },
  ]

  if (customProperties && Object.keys(customProperties).length > 0) {
    fields.push({
      label: "Custom properties",
      value: (
        <pre className="max-h-32 overflow-auto rounded-md bg-muted p-2 text-xs whitespace-pre-wrap">
          {JSON.stringify(customProperties, null, 2)}
        </pre>
      ),
      className: "sm:col-span-2",
    })
  }

  return fields
}

interface MediaPropertiesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MediaItem | null
}

export function MediaPropertiesDialog({
  open,
  onOpenChange,
  item,
}: MediaPropertiesDialogProps) {
  const mediaQuery = useGetMedia(item?.id ?? 0, open && !!item)

  const displayItem = mediaQuery.data ?? item
  const isLoading = mediaQuery.isLoading && !mediaQuery.data

  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Media properties"
      description={
        displayItem
          ? `${displayItem.title ?? displayItem.name} · #${displayItem.id}`
          : undefined
      }
      fields={
        isLoading || !displayItem
          ? Array.from({ length: 8 }).map((_, index) => ({
              label: `loading-${index}`,
              value: <Skeleton className="h-5 w-full" />,
            }))
          : buildFields(displayItem)
      }
    />
  )
}
