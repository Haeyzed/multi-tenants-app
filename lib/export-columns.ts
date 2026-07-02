export type ExportColumnOption = {
  key: string
  label: string
}

export const PLAN_EXPORT_COLUMNS: ExportColumnOption[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "price", label: "Price" },
  { key: "currency", label: "Currency" },
  { key: "interval", label: "Interval" },
  { key: "is_active", label: "Active" },
  { key: "is_featured", label: "Featured" },
  { key: "sort_order", label: "Sort Order" },
  { key: "created_at", label: "Created At" },
]

export const USER_EXPORT_COLUMNS: ExportColumnOption[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "is_active", label: "Active" },
  { key: "created_at", label: "Created At" },
]

export const TENANT_EXPORT_COLUMNS: ExportColumnOption[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created At" },
]

export const BRAND_EXPORT_COLUMNS: ExportColumnOption[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  { key: "is_visible", label: "Visible" },
  { key: "logo_media_id", label: "Logo Media ID" },
  { key: "meta_title", label: "Meta Title" },
  { key: "meta_description", label: "Meta Description" },
  { key: "website_url", label: "Website URL" },
  { key: "sort_order", label: "Sort Order" },
  { key: "created_at", label: "Created At" },
]

export const CATEGORY_EXPORT_COLUMNS: ExportColumnOption[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  { key: "meta_title", label: "Meta Title" },
  { key: "meta_description", label: "Meta Description" },
  { key: "parent_id", label: "Parent ID" },
  { key: "is_visible", label: "Visible" },
  { key: "sort_order", label: "Sort Order" },
  { key: "image_media_id", label: "Image Media ID" },
  { key: "banner_media_id", label: "Banner Media ID" },
  { key: "color", label: "Color" },
  { key: "icon", label: "Icon" },
  { key: "created_at", label: "Created At" },
]
