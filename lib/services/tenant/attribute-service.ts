import {
  Attribute,
  AttributeOption,
  AttributeValue,
} from "@/types/tenant/attribute"
import { AttributeStatistics, ExportParams } from "@/types/tenant/export"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreAttributeFormValues,
  StoreAttributeValueFormValues,
  UpdateAttributeFormValues,
  UpdateAttributeValueFormValues,
} from "@/schemas/tenant/attribute-schema"

export const getAttributes = async (params?: {
  search?: string
  is_filterable?: boolean
  is_variant?: boolean
  type?: string
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Attribute>> => {
  const response = await tenantApiClient.get<ApiResponse<Attribute[]>>(
    "/attributes",
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

export const getAttribute = async (id: number): Promise<Attribute> => {
  const response = await tenantApiClient.get<ApiResponse<Attribute>>(
    `/attributes/${id}`
  )
  return response.data
}

export const createAttribute = async (
  attribute: StoreAttributeFormValues
): Promise<ApiMutationResult<Attribute>> => {
  const response = await tenantApiClient.post<ApiResponse<Attribute>>(
    "/attributes",
    attribute
  )
  return { data: response.data, message: response.message }
}

export const updateAttribute = async (
  id: number,
  attribute: UpdateAttributeFormValues
): Promise<ApiMutationResult<Attribute>> => {
  const response = await tenantApiClient.put<ApiResponse<Attribute>>(
    `/attributes/${id}`,
    attribute
  )
  return { data: response.data, message: response.message }
}

export const deleteAttribute = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/attributes/${id}`
  )
  return { data: null, message: response.message }
}

export const toggleAttributeFilterable = async (
  id: number
): Promise<ApiMutationResult<Attribute>> => {
  const response = await tenantApiClient.post<ApiResponse<Attribute>>(
    `/attributes/${id}/toggle-filterable`,
    {}
  )
  return { data: response.data, message: response.message }
}

export const toggleAttributeVariant = async (
  id: number
): Promise<ApiMutationResult<Attribute>> => {
  const response = await tenantApiClient.post<ApiResponse<Attribute>>(
    `/attributes/${id}/toggle-variant`,
    {}
  )
  return { data: response.data, message: response.message }
}

export const getAttributeOptions = async (): Promise<AttributeOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<AttributeOption[]>>(
    "/attributes/options"
  )
  return response.data
}

export const getAttributeStatistics =
  async (): Promise<AttributeStatistics> => {
    const response = await tenantApiClient.get<
      ApiResponse<AttributeStatistics>
    >("/attributes/statistics")
    return response.data
  }

export const deleteManyAttributes = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/attributes/bulk",
    { ids }
  )
  return { data: null, message: response.message }
}

export const exportAttributes = async (
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
      "/attributes/export",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/attributes/export", body, {
    defaultFilename: `attributes-export.${extension}`,
  })
}

export const downloadAttributesImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/attributes/import/sample",
    { type },
    `attributes-import-sample.${type}`
  )
}

export const importAttributes = async (
  file: File
): Promise<ApiMutationResult<null>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<void>>(
    "/attributes/import",
    formData
  )
  return { data: null, message: response.message }
}

export const getAttributeValues = async (
  attributeId: number
): Promise<AttributeValue[]> => {
  const response = await tenantApiClient.get<ApiResponse<AttributeValue[]>>(
    `/attributes/${attributeId}/values`
  )
  return response.data
}

export const createAttributeValue = async (
  attributeId: number,
  value: StoreAttributeValueFormValues
): Promise<ApiMutationResult<AttributeValue>> => {
  const response = await tenantApiClient.post<ApiResponse<AttributeValue>>(
    `/attributes/${attributeId}/values`,
    value
  )
  return { data: response.data, message: response.message }
}

export const updateAttributeValue = async (
  attributeId: number,
  valueId: number,
  value: UpdateAttributeValueFormValues
): Promise<ApiMutationResult<AttributeValue>> => {
  const response = await tenantApiClient.put<ApiResponse<AttributeValue>>(
    `/attributes/${attributeId}/values/${valueId}`,
    value
  )
  return { data: response.data, message: response.message }
}

export const deleteAttributeValue = async (
  attributeId: number,
  valueId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/attributes/${attributeId}/values/${valueId}`
  )
  return { data: null, message: response.message }
}
