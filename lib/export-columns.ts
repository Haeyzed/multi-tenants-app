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

export const TAX_CLASS_EXPORT_COLUMNS: ExportColumnOption[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "description", label: "Description" },
  { key: "is_default", label: "Default" },
  { key: "is_active", label: "Active" },
  { key: "sort_order", label: "Sort Order" },
  { key: "created_at", label: "Created At" },
]

export const TAX_ZONE_EXPORT_COLUMNS: ExportColumnOption[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "country_code", label: "Country Code" },
  { key: "state", label: "State" },
  { key: "city", label: "City" },
  { key: "postal_code", label: "Postal Code" },
  { key: "postal_code_pattern", label: "Postal Code Pattern" },
  { key: "latitude", label: "Latitude" },
  { key: "longitude", label: "Longitude" },
  { key: "radius_km", label: "Radius (km)" },
  { key: "is_default", label: "Default" },
  { key: "is_active", label: "Active" },
  { key: "sort_order", label: "Sort Order" },
  { key: "created_at", label: "Created At" },
]

export const CUSTOMER_EXPORT_COLUMNS: ExportColumnOption[] = [
  { key: "id", label: "ID" },
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "customer_group_id", label: "Customer Group ID" },
  { key: "customer_group_name", label: "Customer Group" },
  { key: "date_of_birth", label: "Date of Birth" },
  { key: "gender", label: "Gender" },
  { key: "loyalty_points", label: "Loyalty Points" },
  { key: "total_spent", label: "Total Spent" },
  { key: "orders_count", label: "Orders Count" },
  { key: "is_active", label: "Active" },
  { key: "created_at", label: "Created At" },
]

export const CUSTOMER_GROUP_EXPORT_COLUMNS: ExportColumnOption[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
  { key: "discount_percent", label: "Discount %" },
  { key: "is_active", label: "Active" },
  { key: "customers_count", label: "Customers Count" },
  { key: "created_at", label: "Created At" },
]

export const PRODUCT_EXPORT_COLUMNS: ExportColumnOption[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "sku", label: "SKU" },
  { key: "barcode", label: "Barcode" },
  { key: "price", label: "Price" },
  { key: "compare_at_price", label: "Compare At Price" },
  { key: "sale_price", label: "Sale Price" },
  { key: "cost_price", label: "Cost Price" },
  { key: "status", label: "Status" },
  { key: "is_featured", label: "Featured" },
  { key: "product_type", label: "Type" },
  { key: "category", label: "Category" },
  { key: "brand", label: "Brand" },
  { key: "quantity", label: "Quantity" },
  { key: "created_at", label: "Created At" },
]
