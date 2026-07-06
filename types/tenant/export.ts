export type ExportParams = {
  ids?: (number | string)[]
  delivery: "download" | "email"
  type?: "xlsx" | "csv"
  start_date?: string
  end_date?: string
  recipient_id?: number
  columns?: string[]
}

export type ExportFileType = "xlsx" | "csv"

export type ExportSelection = {
  ids: (number | string)[]
  onComplete?: () => void
}

export type BulkDeleteSelection = ExportSelection

export type BrandStatistics = {
  total: number
  visible: number
  hidden: number
}

export type SupplierStatistics = {
  total: number
  active: number
  inactive: number
  with_products: number
}

export type WarehouseStatistics = {
  total: number
  active: number
  inactive: number
  primary: number
  with_inventory: number
}

export type CategoryStatistics = {
  total: number
  visible: number
  hidden: number
  root: number
}

export type TaxClassStatistics = {
  total: number
  active: number
  inactive: number
  default: number
}

export type TaxZoneStatistics = {
  total: number
  active: number
  inactive: number
  default: number
}

export type TaxRateStatistics = {
  total: number
  active: number
  inactive: number
  compound: number
}

export type TaxRuleStatistics = {
  total: number
  active: number
  inactive: number
  override: number
}

export type CustomerStatistics = {
  total: number
  active: number
  inactive: number
}

export type CustomerGroupStatistics = {
  total: number
  active: number
  inactive: number
}

export type ProductStatistics = {
  total: number
  draft: number
  active: number
  archived: number
  featured: number
  low_stock: number
}

export type UnitStatistics = {
  total: number
  base: number
  types: Record<string, number>
}

export type TagStatistics = {
  total: number
  visible: number
  hidden: number
}

export type AttributeStatistics = {
  total: number
  filterable: number
  variant: number
}

export type AttributeSetStatistics = {
  total: number
  active: number
  inactive: number
}

export type CollectionStatistics = {
  total: number
  visible: number
  featured: number
}
