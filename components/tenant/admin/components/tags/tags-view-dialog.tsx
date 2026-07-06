"use client"

import { format } from "date-fns"

import {
  ModuleViewDialog,
  ModuleViewVisibility,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { type Tag } from "@/types/tenant/tag"

type TagsViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag: Tag
}

function getTagViewFields(tag: Tag): ModuleViewField[] {
  return [
    { label: "Name", value: tag.name },
    { label: "Slug", value: tag.slug },
    {
      label: "Color",
      value: tag.color ? (
        <div className="flex items-center gap-2">
          <span
            className="inline-block size-4 shrink-0 rounded border"
            style={{ backgroundColor: tag.color }}
            aria-hidden
          />
          <span className="font-mono text-sm">{tag.color}</span>
        </div>
      ) : (
        "—"
      ),
    },
    { label: "Icon", value: tag.icon || "—" },
    {
      label: "Visibility",
      value: <ModuleViewVisibility isVisible={tag.is_visible} />,
    },
    { label: "Products", value: String(tag.products_count ?? 0) },
    { label: "Sort order", value: String(tag.sort_order ?? 0) },
    {
      label: "Created",
      value: tag.created_at
        ? format(new Date(tag.created_at), "PPP")
        : "—",
    },
  ]
}

export function TagsViewDialog({
  open,
  onOpenChange,
  tag,
}: TagsViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={tag.name}
      description={`Tag details · ${tag.slug}`}
      fields={getTagViewFields(tag)}
    />
  )
}
