import { Attribute } from "@/types/tenant/attribute"
import { AttributeSet, AttributeSetOption } from "@/types/tenant/attribute-set"
import { AttributeSetStatistics, ExportParams } from "@/types/tenant/export"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreAttributeSetFormValues,
  UpdateAttributeSetFormValues,
} from "@/schemas/tenant/attribute-set-schema"

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

export const getAttributeSets = async (params?: {
  search?: string
  is_active?: boolean
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<AttributeSet>> => {
  const response = await tenantApiClient.get<ApiResponse<AttributeSet[]>>(
    "/attribute-sets",
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

export const getAttributeSet = async (id: number): Promise<AttributeSet> => {
  const response = await tenantApiClient.get<ApiResponse<AttributeSet>>(
    `/attribute-sets/${id}`
  )
  return response.data
}

export const createAttributeSet = async (
  attributeSet: StoreAttributeSetFormValues
): Promise<AttributeSet> => {
  const response = await tenantApiClient.post<ApiResponse<AttributeSet>>(
    "/attribute-sets",
    attributeSet
  )
  return response.data
}

export const updateAttributeSet = async (
  id: number,
  attributeSet: UpdateAttributeSetFormValues
): Promise<AttributeSet> => {
  const response = await tenantApiClient.put<ApiResponse<AttributeSet>>(
    `/attribute-sets/${id}`,
    attributeSet
  )
  return response.data
}

export const deleteAttributeSet = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/attribute-sets/${id}`)
}

export const getAttributeSetOptions = async (): Promise<
  AttributeSetOption[]
> => {
  const response = await tenantApiClient.get<ApiResponse<AttributeSetOption[]>>(
    "/attribute-sets/options"
  )
  return response.data
}

export const getAttributeSetStatistics =
  async (): Promise<AttributeSetStatistics> => {
    const response = await tenantApiClient.get<
      ApiResponse<AttributeSetStatistics>
    >("/attribute-sets/statistics")
    return response.data
  }

export const deleteManyAttributeSets = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/attribute-sets/bulk", {
    ids,
  })
}

export const exportAttributeSets = async (
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
    await tenantApiClient.post<ApiResponse<void>>(
      "/attribute-sets/export",
      body
    )
    return
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/attribute-sets/export", body, {
    defaultFilename: `attribute-sets-export.${extension}`,
  })
}

export const downloadAttributeSetsImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/attribute-sets/import/sample",
    { type },
    `attribute-sets-import-sample.${type}`
  )
}

export const importAttributeSets = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append("file", file)
  await tenantApiClient.upload<ApiResponse<void>>(
    "/attribute-sets/import",
    formData
  )
}

export const getAttributeSetAttributes = async (
  attributeSetId: number
): Promise<Attribute[]> => {
  const response = await tenantApiClient.get<ApiResponse<Attribute[]>>(
    `/attribute-sets/${attributeSetId}/attributes`
  )
  return response.data
}

export const syncAttributeSetAttributes = async (
  attributeSetId: number,
  attributeIds: number[]
): Promise<AttributeSet> => {
  const response = await tenantApiClient.put<ApiResponse<AttributeSet>>(
    `/attribute-sets/${attributeSetId}/attributes`,
    { attribute_ids: attributeIds }
  )
  return response.data
}
