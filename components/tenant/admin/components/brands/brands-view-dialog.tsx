"use client"

import { format } from "date-fns"

import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import {
  ModuleViewDialog,
  ModuleViewVisibility,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { type Brand } from "@/types/tenant/brand"

type BrandsViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  brand: Brand
}

function getBrandViewFields(brand: Brand): ModuleViewField[] {
  return [
    { label: "Name", value: brand.name },
    { label: "Slug", value: brand.slug },
    {
      label: "Summary",
      value: brand.summary || "—",
      className: "sm:col-span-2",
    },
    {
      label: "Description",
      value: brand.description || "—",
      className: "sm:col-span-2",
    },
    { label: "Website", value: brand.website_url || "—" },
    { label: "Country of origin", value: brand.country_of_origin || "—" },
    {
      label: "Visibility",
      value: <ModuleViewVisibility isVisible={brand.is_visible} />,
    },
    {
      label: "Featured",
      value: brand.is_featured ? "Yes" : "No",
    },
    { label: "Products", value: String(brand.products_count ?? 0) },
    { label: "Sort order", value: String(brand.sort_order ?? 0) },
    { label: "Meta title", value: brand.meta_title || "—" },
    {
      label: "Meta description",
      value: brand.meta_description || "—",
      className: "sm:col-span-2",
    },
    {
      label: "Logo",
      value: brand.logo?.url ? (
        <MediaThumbnail media={brand.logo} alt={brand.name} size="md" />
      ) : (
        "—"
      ),
    },
    {
      label: "Banner",
      value: brand.banner?.url ? (
        <MediaThumbnail
          media={brand.banner}
          alt={`${brand.name} banner`}
          size="md"
        />
      ) : (
        "—"
      ),
    },
    {
      label: "Created",
      value: brand.created_at
        ? format(new Date(brand.created_at), "PPP")
        : "—",
    },
  ]
}

export function BrandsViewDialog({
  open,
  onOpenChange,
  brand,
}: BrandsViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={brand.name}
      description={`Brand details · ${brand.slug}`}
      fields={getBrandViewFields(brand)}
    />
  )
}
