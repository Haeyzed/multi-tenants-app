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

export type CategoryStatistics = {
  total: number
  visible: number
  hidden: number
  root: number
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
