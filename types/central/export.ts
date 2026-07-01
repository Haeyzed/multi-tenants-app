export type ExportParams = {
  ids?: (number | string)[]
  delivery: "download" | "email"
  start_date?: string
  end_date?: string
  recipient_id?: number
}

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
