import { Brand, BrandOption } from "@/types/tenant/brand"
import { BrandStatistics, ExportParams } from "@/types/tenant/export"
import { normalizeEmbeddedMedia } from "@/lib/tenant/normalize-embedded-media"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreBrandFormValues,
  UpdateBrandFormValues,
} from "@/schemas/tenant/brand-schema"

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

function normalizeBrand(brand: Brand): Brand {
  return {
    ...brand,
    logo: normalizeEmbeddedMedia(brand.logo),
    banner: normalizeEmbeddedMedia(brand.banner),
  }
}

export const getBrands = async (params?: {
  search?: string
  is_visible?: ("visible" | "hidden")[]
  is_featured?: boolean
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Brand>> => {
  const response = await tenantApiClient.get<ApiResponse<Brand[]>>(
    "/brands",
    params
  )
  return {
    data: response.data.map(normalizeBrand),
    meta: response.meta || {
      current_page: 1,
      last_page: 1,
      per_page: params?.per_page || 15,
      total: response.data.length,
    },
  }
}

export const getBrand = async (id: number): Promise<Brand> => {
  const response = await tenantApiClient.get<ApiResponse<Brand>>(
    `/brands/${id}`
  )
  return normalizeBrand(response.data)
}

export const getBrandBySlug = async (slug: string): Promise<Brand> => {
  const response = await tenantApiClient.get<ApiResponse<Brand>>(
    `/brands/slug/${slug}`
  )
  return normalizeBrand(response.data)
}

export const createBrand = async (
  brand: StoreBrandFormValues
): Promise<Brand> => {
  const response = await tenantApiClient.post<ApiResponse<Brand>>(
    "/brands",
    brand
  )
  return normalizeBrand(response.data)
}

export const updateBrand = async (
  id: number,
  brand: UpdateBrandFormValues
): Promise<Brand> => {
  const response = await tenantApiClient.put<ApiResponse<Brand>>(
    `/brands/${id}`,
    brand
  )
  return normalizeBrand(response.data)
}

export const deleteBrand = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/brands/${id}`)
}

export const toggleBrandVisibility = async (id: number): Promise<Brand> => {
  const response = await tenantApiClient.post<ApiResponse<Brand>>(
    `/brands/${id}/toggle-visibility`
  )
  return normalizeBrand(response.data)
}

export const toggleBrandFeatured = async (id: number): Promise<Brand> => {
  const response = await tenantApiClient.post<ApiResponse<Brand>>(
    `/brands/${id}/toggle-featured`
  )
  return normalizeBrand(response.data)
}

export const reorderBrands = async (ids: number[]): Promise<void> => {
  await tenantApiClient.put<ApiResponse<void>>("/brands/reorder", { ids })
}

export const getBrandOptions = async (): Promise<BrandOption[]> => {
  const response =
    await tenantApiClient.get<ApiResponse<BrandOption[]>>("/brands/options")
  return response.data
}

export const getBrandStatistics = async (): Promise<BrandStatistics> => {
  const response =
    await tenantApiClient.get<ApiResponse<BrandStatistics>>(
      "/brands/statistics"
    )
  return response.data
}

export const deleteManyBrands = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/brands/bulk", { ids })
}

export const exportBrands = async (params: ExportParams): Promise<void> => {
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
    await tenantApiClient.post<ApiResponse<void>>("/brands/export", body)
    return
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/brands/export", body, {
    defaultFilename: `brands-export.${extension}`,
  })
}

export const downloadBrandsImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/brands/import/sample",
    { type },
    `brands-import-sample.${type}`
  )
}

export const importBrands = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append("file", file)
  await tenantApiClient.upload<ApiResponse<void>>("/brands/import", formData)
}
