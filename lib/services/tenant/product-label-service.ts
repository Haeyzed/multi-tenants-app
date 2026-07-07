import {
  ProductLabel,
  ProductLabelOption,
} from "@/types/tenant/product-label"
import { ExportParams, ProductLabelStatistics } from "@/types/tenant/export"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreProductLabelFormValues,
  UpdateProductLabelFormValues,
} from "@/schemas/tenant/product-label-schema"

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

export const getProductLabels = async (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<ProductLabel>> => {
  const response = await tenantApiClient.get<ApiResponse<ProductLabel[]>>(
    "/product-labels",
    params
  )
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

export const getProductLabel = async (id: number): Promise<ProductLabel> => {
  const response = await tenantApiClient.get<ApiResponse<ProductLabel>>(
    `/product-labels/${id}`
  )
  return response.data
}

export const createProductLabel = async (
  label: StoreProductLabelFormValues
): Promise<ProductLabel> => {
  const response = await tenantApiClient.post<ApiResponse<ProductLabel>>(
    "/product-labels",
    label
  )
  return response.data
}

export const updateProductLabel = async (
  id: number,
  label: UpdateProductLabelFormValues
): Promise<ProductLabel> => {
  const response = await tenantApiClient.put<ApiResponse<ProductLabel>>(
    `/product-labels/${id}`,
    label
  )
  return response.data
}

export const deleteProductLabel = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/product-labels/${id}`)
}

export const toggleProductLabelActive = async (
  id: number
): Promise<ProductLabel> => {
  const response = await tenantApiClient.post<ApiResponse<ProductLabel>>(
    `/product-labels/${id}/toggle-active`,
    {}
  )
  return response.data
}

export const getProductLabelOptions = async (): Promise<ProductLabelOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<ProductLabelOption[]>>(
    "/product-labels/options"
  )
  return response.data
}

export const getProductLabelStatistics =
  async (): Promise<ProductLabelStatistics> => {
    const response = await tenantApiClient.get<
      ApiResponse<ProductLabelStatistics>
    >("/product-labels/statistics")
    return response.data
  }

export const deleteManyProductLabels = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/product-labels/bulk", {
    ids,
  })
}

export const exportProductLabels = async (
  params: ExportParams
): Promise<void> => {
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
    await tenantApiClient.post<ApiResponse<void>>("/product-labels/export", body)
    return
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/product-labels/export", body, {
    defaultFilename: `product-labels-export.${extension}`,
  })
}

export const downloadProductLabelsImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/product-labels/import/sample",
    { type },
    `product-labels-import-sample.${type}`
  )
}

export const importProductLabels = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append("file", file)
  await tenantApiClient.upload<ApiResponse<void>>(
    "/product-labels/import",
    formData
  )
}
