import {
  Category,
  CategoryOption,
  CategoryTreeNode,
} from "@/types/tenant/category"
import { CategoryStatistics, ExportParams } from "@/types/tenant/export"
import { normalizeEmbeddedMedia } from "@/lib/tenant/normalize-embedded-media"
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

function normalizeCategory(category: Category): Category {
  return {
    ...category,
    image: normalizeEmbeddedMedia(category.image),
    banner: normalizeEmbeddedMedia(category.banner),
    icon: normalizeEmbeddedMedia(category.icon),
    parent: category.parent
      ? normalizeCategory(category.parent)
      : category.parent,
  }
}

export const getCategories = async (params?: {
  search?: string
  is_visible?: ("visible" | "hidden")[]
  is_featured?: boolean
  parent_id?: number
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Category>> => {
  const response = await tenantApiClient.get<ApiResponse<Category[]>>(
    "/categories",
    params as Record<string, string | number | boolean | undefined>
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

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await tenantApiClient.get<ApiResponse<Category>>(
    `/categories/slug/${slug}`
  )
  return normalizeCategory(response.data)
}

export const getCategoryTree = async (): Promise<CategoryTreeNode[]> => {
  const response =
    await tenantApiClient.get<ApiResponse<{ tree: CategoryTreeNode[] }>>(
      "/categories/tree"
    )
  return response.data.tree
}

export const getCategoryTreeSelect = async (): Promise<CategoryOption[]> => {
  const response = await tenantApiClient.get<
    ApiResponse<Record<string, string>>
  >("/categories/tree-select")

  return Object.entries(response.data).map(([id, label]) => ({
    value: Number(id),
    label,
  }))
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

export const toggleCategoryVisibility = async (
  id: number
): Promise<Category> => {
  const response = await tenantApiClient.post<ApiResponse<Category>>(
    `/categories/${id}/toggle-visibility`
  )
  return normalizeCategory(response.data)
}

export const toggleCategoryFeatured = async (id: number): Promise<Category> => {
  const response = await tenantApiClient.post<ApiResponse<Category>>(
    `/categories/${id}/toggle-featured`
  )
  return normalizeCategory(response.data)
}

export const reorderCategories = async (ids: number[]): Promise<void> => {
  await tenantApiClient.put<ApiResponse<void>>("/categories/reorder", { ids })
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
  await tenantApiClient.upload<ApiResponse<void>>(
    "/categories/import",
    formData
  )
}
