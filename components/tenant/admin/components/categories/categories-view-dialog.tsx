"use client"

import { format } from "date-fns"

import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import {
  ModuleViewDialog,
  ModuleViewVisibility,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { type Category } from "@/types/tenant/category"

type CategoriesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category
}

function getCategoryViewFields(category: Category): ModuleViewField[] {
  return [
    { label: "Name", value: category.name },
    { label: "Slug", value: category.slug },
    { label: "Parent", value: category.parent?.name ?? "Root" },
    {
      label: "Description",
      value: category.description || "—",
      className: "sm:col-span-2",
    },
    {
      label: "Visibility",
      value: <ModuleViewVisibility isVisible={category.is_visible} />,
    },
    { label: "Sort order", value: String(category.sort_order ?? 0) },
    { label: "Meta title", value: category.meta_title || "—" },
    {
      label: "Meta description",
      value: category.meta_description || "—",
      className: "sm:col-span-2",
    },
    {
      label: "Image",
      value: category.image?.url ? (
        <MediaThumbnail media={category.image} alt={category.name} size="md" />
      ) : (
        "—"
      ),
    },
    {
      label: "Banner",
      value: category.banner?.url ? (
        <MediaThumbnail
          media={category.banner}
          alt={`${category.name} banner`}
          size="md"
        />
      ) : (
        "—"
      ),
    },
    {
      label: "Created",
      value: category.created_at
        ? format(new Date(category.created_at), "PPP")
        : "—",
    },
  ]
}

export function CategoriesViewDialog({
  open,
  onOpenChange,
  category,
}: CategoriesViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={category.name}
      description={`Category details · ${category.slug}`}
      fields={getCategoryViewFields(category)}
    />
  )
}
