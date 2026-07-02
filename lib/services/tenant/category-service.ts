import { Category, CategoryOption, TenantMedia } from "@/types/tenant/category"
import { ExportParams, CategoryStatistics } from "@/types/tenant/export"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreCategoryFormValues,
  UpdateCategoryFormValues,
} from "@/schemas/tenant/category-schema"

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

function normalizeMedia(media?: TenantMedia | null): TenantMedia | null | undefined {
  if (!media) return media
  return { ...media, url: resolveTenantMediaUrl(media) }
}

function normalizeCategory(category: Category): Category {
  return {
    ...category,
    image: normalizeMedia(category.image) ?? null,
    banner: normalizeMedia(category.banner) ?? null,
  }
}

export const getCategories = async (params?: {
  search?: string
  is_visible?: ("visible" | "hidden")[]
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Category>> => {
  const response = await tenantApiClient.get<ApiResponse<Category[]>>(
    "/categories",
    params as Record<string, string | undefined>
  )
  return {
    data: response.data.map(normalizeCategory),
    meta: response.meta || {
      current_page: 1,
      last_page: 1,
      per_page: params?.per_page || 15,
      total: response.data.length,
    },
  }
}

export const getCategory = async (id: number): Promise<Category> => {
  const response = await tenantApiClient.get<ApiResponse<Category>>(
    `/categories/${id}`
  )
  return normalizeCategory(response.data)
}

export const createCategory = async (
  category: StoreCategoryFormValues
): Promise<Category> => {
  const response = await tenantApiClient.post<ApiResponse<Category>>(
    "/categories",
    category
  )
  return normalizeCategory(response.data)
}

export const updateCategory = async (
  id: number,
  category: UpdateCategoryFormValues
): Promise<Category> => {
  const response = await tenantApiClient.put<ApiResponse<Category>>(
    `/categories/${id}`,
    category
  )
  return normalizeCategory(response.data)
}

export const deleteCategory = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/categories/${id}`)
}

export const getCategoryOptions = async (): Promise<CategoryOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<CategoryOption[]>>(
    "/categories/options"
  )
  return response.data
}

export const getCategoryStatistics = async (): Promise<CategoryStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<CategoryStatistics>>(
    "/categories/statistics"
  )
  return response.data
}

export const deleteManyCategories = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/categories/bulk", { ids })
}

export const exportCategories = async (params: ExportParams): Promise<void> => {
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
    await tenantApiClient.post<ApiResponse<void>>("/categories/export", body)
    return
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/categories/export", body, {
    defaultFilename: `categories-export.${extension}`,
  })
}

export const downloadCategoriesImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/categories/import/sample",
    { type },
    `categories-import-sample.${type}`
  )
}

export const importCategories = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append("file", file)
  await tenantApiClient.upload<ApiResponse<void>>("/categories/import", formData)
}
