import { ProductLabel, ProductLabelOption } from "@/types/tenant/product-label"
import { ExportParams, ProductLabelStatistics } from "@/types/tenant/export"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreProductLabelFormValues,
  UpdateProductLabelFormValues,
} from "@/schemas/tenant/product-label-schema"

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
): Promise<ApiMutationResult<ProductLabel>> => {
  const response = await tenantApiClient.post<ApiResponse<ProductLabel>>(
    "/product-labels",
    label
  )
  return { data: response.data, message: response.message }
}

export const updateProductLabel = async (
  id: number,
  label: UpdateProductLabelFormValues
): Promise<ApiMutationResult<ProductLabel>> => {
  const response = await tenantApiClient.put<ApiResponse<ProductLabel>>(
    `/product-labels/${id}`,
    label
  )
  return { data: response.data, message: response.message }
}

export const deleteProductLabel = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/product-labels/${id}`
  )
  return { data: null, message: response.message }
}

export const toggleProductLabelActive = async (
  id: number
): Promise<ApiMutationResult<ProductLabel>> => {
  const response = await tenantApiClient.post<ApiResponse<ProductLabel>>(
    `/product-labels/${id}/toggle-active`,
    {}
  )
  return { data: response.data, message: response.message }
}

export const getProductLabelOptions = async (): Promise<
  ProductLabelOption[]
> => {
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

export const deleteManyProductLabels = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/product-labels/bulk",
    {
      ids,
    }
  )
  return { data: null, message: response.message }
}

export const exportProductLabels = async (
  params: ExportParams
): Promise<void | ApiMutationResult<null>> => {
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
    const response = await tenantApiClient.post<ApiResponse<void>>(
      "/product-labels/export",
      body
    )
    return { data: null, message: response.message }
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

export const importProductLabels = async (
  file: File
): Promise<ApiMutationResult<null>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<void>>(
    "/product-labels/import",
    formData
  )
  return { data: null, message: response.message }
}
