import { Tag, TagOption } from "@/types/tenant/tag"
import { ExportParams, TagStatistics } from "@/types/tenant/export"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreTagFormValues,
  UpdateTagFormValues,
} from "@/schemas/tenant/tag-schema"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const getTags = async (params?: {
  search?: string
  is_visible?: ("visible" | "hidden")[]
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Tag>> => {
  const response = await tenantApiClient.get<ApiResponse<Tag[]>>("/tags", params)
  return {
    data: response.data,
    meta: response.meta || {
      current_page: 1,
      last_page: 1,
      per_page: params?.per_page || 15,
      total: response.data.length,
    },
  }
}

export const getTag = async (id: number): Promise<Tag> => {
  const response = await tenantApiClient.get<ApiResponse<Tag>>(`/tags/${id}`)
  return response.data
}

export const createTag = async (tag: StoreTagFormValues): Promise<Tag> => {
  const response = await tenantApiClient.post<ApiResponse<Tag>>("/tags", tag)
  return response.data
}

export const updateTag = async (
  id: number,
  tag: UpdateTagFormValues
): Promise<Tag> => {
  const response = await tenantApiClient.put<ApiResponse<Tag>>(
    `/tags/${id}`,
    tag
  )
  return response.data
}

export const deleteTag = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/tags/${id}`)
}

export const toggleTagVisibility = async (id: number): Promise<Tag> => {
  const response = await tenantApiClient.post<ApiResponse<Tag>>(
    `/tags/${id}/toggle-visibility`,
    {}
  )
  return response.data
}

export const reorderTags = async (ids: number[]): Promise<void> => {
  await tenantApiClient.put<ApiResponse<void>>("/tags/reorder", { ids })
}

export const getTagOptions = async (): Promise<TagOption[]> => {
  const response =
    await tenantApiClient.get<ApiResponse<TagOption[]>>("/tags/options")
  return response.data
}

export const getTagStatistics = async (): Promise<TagStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<TagStatistics>>(
    "/tags/statistics"
  )
  return response.data
}

export const deleteManyTags = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/tags/bulk", { ids })
}

export const exportTags = async (params: ExportParams): Promise<void> => {
  const body = {
    ids: params.ids,
    delivery: params.delivery,
    type: params.type ?? "xlsx",
    start_date: params.start_date,
    end_date: params.end_date,
    recipient_id: params.recipient_id,
    columns: params.columns,
  }

  if (params.delivery === "email") {
    await tenantApiClient.post<ApiResponse<void>>("/tags/export", body)
    return
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/tags/export", body, {
    defaultFilename: `tags-export.${extension}`,
  })
}

export const downloadTagsImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/tags/import/sample",
    { type },
    `tags-import-sample.${type}`
  )
}

export const importTags = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append("file", file)
  await tenantApiClient.upload<ApiResponse<void>>("/tags/import", formData)
}
