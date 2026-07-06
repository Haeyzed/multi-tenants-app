import { Attribute, AttributeOption, AttributeValue } from "@/types/tenant/attribute"
import { ExportParams, AttributeStatistics } from "@/types/tenant/export"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreAttributeFormValues,
  StoreAttributeValueFormValues,
  UpdateAttributeFormValues,
  UpdateAttributeValueFormValues,
} from "@/schemas/tenant/attribute-schema"

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
): Promise<Attribute> => {
  const response = await tenantApiClient.post<ApiResponse<Attribute>>(
    "/attributes",
    attribute
  )
  return response.data
}

export const updateAttribute = async (
  id: number,
  attribute: UpdateAttributeFormValues
): Promise<Attribute> => {
  const response = await tenantApiClient.put<ApiResponse<Attribute>>(
    `/attributes/${id}`,
    attribute
  )
  return response.data
}

export const deleteAttribute = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/attributes/${id}`)
}

export const toggleAttributeFilterable = async (
  id: number
): Promise<Attribute> => {
  const response = await tenantApiClient.post<ApiResponse<Attribute>>(
    `/attributes/${id}/toggle-filterable`,
    {}
  )
  return response.data
}

export const toggleAttributeVariant = async (id: number): Promise<Attribute> => {
  const response = await tenantApiClient.post<ApiResponse<Attribute>>(
    `/attributes/${id}/toggle-variant`,
    {}
  )
  return response.data
}

export const getAttributeOptions = async (): Promise<AttributeOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<AttributeOption[]>>(
    "/attributes/options"
  )
  return response.data
}

export const getAttributeStatistics = async (): Promise<AttributeStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<AttributeStatistics>>(
    "/attributes/statistics"
  )
  return response.data
}

export const deleteManyAttributes = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/attributes/bulk", { ids })
}

export const exportAttributes = async (params: ExportParams): Promise<void> => {
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
    await tenantApiClient.post<ApiResponse<void>>("/attributes/export", body)
    return
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

export const importAttributes = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append("file", file)
  await tenantApiClient.upload<ApiResponse<void>>("/attributes/import", formData)
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
): Promise<AttributeValue> => {
  const response = await tenantApiClient.post<ApiResponse<AttributeValue>>(
    `/attributes/${attributeId}/values`,
    value
  )
  return response.data
}

export const updateAttributeValue = async (
  attributeId: number,
  valueId: number,
  value: UpdateAttributeValueFormValues
): Promise<AttributeValue> => {
  const response = await tenantApiClient.put<ApiResponse<AttributeValue>>(
    `/attributes/${attributeId}/values/${valueId}`,
    value
  )
  return response.data
}

export const deleteAttributeValue = async (
  attributeId: number,
  valueId: number
): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(
    `/attributes/${attributeId}/values/${valueId}`
  )
}
