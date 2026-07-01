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

export type PlanStatistics = {
  total: number
  active: number
  inactive: number
  featured: number
}

export type UserStatistics = {
  total: number
  active: number
  inactive: number
}

export type UserOption = {
  label: string
  value: number
  email: string
}
