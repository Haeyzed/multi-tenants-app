import { Collection, CollectionOption } from "@/types/tenant/collection"
import { CollectionStatistics, ExportParams } from "@/types/tenant/export"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { normalizeEmbeddedMedia } from "@/lib/tenant/normalize-embedded-media"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreCollectionFormValues,
  UpdateCollectionFormValues,
} from "@/schemas/tenant/collection-schema"

function normalizeCollection(collection: Collection): Collection {
  return {
    ...collection,
    image: normalizeEmbeddedMedia(collection.image),
    banner: normalizeEmbeddedMedia(collection.banner),
  }
}

export const getCollections = async (params?: {
  search?: string
  is_visible?: ("visible" | "hidden")[]
  is_featured?: boolean
  type?: string
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Collection>> => {
  const response = await tenantApiClient.get<ApiResponse<Collection[]>>(
    "/collections",
    params
  )
  return {
    data: response.data.map(normalizeCollection),
    meta: response.meta || {
      current_page: 1,
      last_page: 1,
      per_page: params?.per_page || 15,
      total: response.data.length,
    },
  }
}

export const getCollection = async (id: number): Promise<Collection> => {
  const response = await tenantApiClient.get<ApiResponse<Collection>>(
    `/collections/${id}`
  )
  return normalizeCollection(response.data)
}

export const createCollection = async (
  collection: StoreCollectionFormValues
): Promise<ApiMutationResult<Collection>> => {
  const response = await tenantApiClient.post<ApiResponse<Collection>>(
    "/collections",
    collection
  )
  return {
    data: normalizeCollection(response.data),
    message: response.message,
  }
}

export const updateCollection = async (
  id: number,
  collection: UpdateCollectionFormValues
): Promise<ApiMutationResult<Collection>> => {
  const response = await tenantApiClient.put<ApiResponse<Collection>>(
    `/collections/${id}`,
    collection
  )
  return {
    data: normalizeCollection(response.data),
    message: response.message,
  }
}

export const deleteCollection = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/collections/${id}`
  )
  return { data: null, message: response.message }
}

export const toggleCollectionVisibility = async (
  id: number
): Promise<ApiMutationResult<Collection>> => {
  const response = await tenantApiClient.post<ApiResponse<Collection>>(
    `/collections/${id}/toggle-visibility`,
    {}
  )
  return {
    data: normalizeCollection(response.data),
    message: response.message,
  }
}

export const toggleCollectionFeatured = async (
  id: number
): Promise<ApiMutationResult<Collection>> => {
  const response = await tenantApiClient.post<ApiResponse<Collection>>(
    `/collections/${id}/toggle-featured`,
    {}
  )
  return {
    data: normalizeCollection(response.data),
    message: response.message,
  }
}

export const getCollectionOptions = async (): Promise<CollectionOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<CollectionOption[]>>(
    "/collections/options"
  )
  return response.data
}

export const getCollectionStatistics =
  async (): Promise<CollectionStatistics> => {
    const response = await tenantApiClient.get<
      ApiResponse<CollectionStatistics>
    >("/collections/statistics")
    return response.data
  }

export const deleteManyCollections = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/collections/bulk",
    { ids }
  )
  return { data: null, message: response.message }
}

export const exportCollections = async (
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
      "/collections/export",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/collections/export", body, {
    defaultFilename: `collections-export.${extension}`,
  })
}

export const downloadCollectionsImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/collections/import/sample",
    { type },
    `collections-import-sample.${type}`
  )
}

export const importCollections = async (
  file: File
): Promise<ApiMutationResult<null>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<void>>(
    "/collections/import",
    formData
  )
  return { data: null, message: response.message }
}
