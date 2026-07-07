"use client"

import { format } from "date-fns"

import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import {
  ModuleViewDialog,
  type ModuleViewField,
  ModuleViewVisibility,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { Badge } from "@/components/ui/badge"
import { type Collection } from "@/types/tenant/collection"

type CollectionsViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: Collection
}

function getCollectionViewFields(collection: Collection): ModuleViewField[] {
  return [
    { label: "Name", value: collection.name },
    { label: "Slug", value: collection.slug },
    {
      label: "Description",
      value: collection.description || "—",
      className: "sm:col-span-2",
    },
    {
      label: "Type",
      value: (
        <Badge variant="outline" className="capitalize">
          {collection.type}
        </Badge>
      ),
    },
    {
      label: "Visibility",
      value: <ModuleViewVisibility isVisible={collection.is_visible} />,
    },
    {
      label: "Featured",
      value: collection.is_featured ? "Yes" : "No",
    },
    { label: "Products", value: String(collection.products_count ?? 0) },
    { label: "Sort order", value: String(collection.sort_order ?? 0) },
    { label: "Sort by", value: collection.sort_by || "—" },
    { label: "Meta title", value: collection.meta_title || "—" },
    {
      label: "Meta description",
      value: collection.meta_description || "—",
      className: "sm:col-span-2",
    },
    {
      label: "Conditions",
      value: collection.conditions
        ? JSON.stringify(collection.conditions, null, 2)
        : "—",
      className: "sm:col-span-2",
    },
    {
      label: "Image",
      value: collection.image?.url ? (
        <MediaThumbnail
          media={collection.image}
          alt={collection.name}
          size="md"
        />
      ) : (
        "—"
      ),
    },
    {
      label: "Banner",
      value: collection.banner?.url ? (
        <MediaThumbnail
          media={collection.banner}
          alt={`${collection.name} banner`}
          size="md"
        />
      ) : (
        "—"
      ),
    },
    {
      label: "Created",
      value: collection.created_at
        ? format(new Date(collection.created_at), "PPP")
        : "—",
    },
  ]
}

export function CollectionsViewDialog({
  open,
  onOpenChange,
  collection,
}: CollectionsViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={collection.name}
      description={`Collection details · ${collection.slug}`}
      fields={getCollectionViewFields(collection)}
    />
  )
}
