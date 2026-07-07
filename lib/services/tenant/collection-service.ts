import { Collection, CollectionOption } from "@/types/tenant/collection"
import { CollectionStatistics, ExportParams } from "@/types/tenant/export"
import { normalizeEmbeddedMedia } from "@/lib/tenant/normalize-embedded-media"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreCollectionFormValues,
  UpdateCollectionFormValues,
} from "@/schemas/tenant/collection-schema"

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
): Promise<Collection> => {
  const response = await tenantApiClient.post<ApiResponse<Collection>>(
    "/collections",
    collection
  )
  return normalizeCollection(response.data)
}

export const updateCollection = async (
  id: number,
  collection: UpdateCollectionFormValues
): Promise<Collection> => {
  const response = await tenantApiClient.put<ApiResponse<Collection>>(
    `/collections/${id}`,
    collection
  )
  return normalizeCollection(response.data)
}

export const deleteCollection = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/collections/${id}`)
}

export const toggleCollectionVisibility = async (
  id: number
): Promise<Collection> => {
  const response = await tenantApiClient.post<ApiResponse<Collection>>(
    `/collections/${id}/toggle-visibility`,
    {}
  )
  return normalizeCollection(response.data)
}

export const toggleCollectionFeatured = async (
  id: number
): Promise<Collection> => {
  const response = await tenantApiClient.post<ApiResponse<Collection>>(
    `/collections/${id}/toggle-featured`,
    {}
  )
  return normalizeCollection(response.data)
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

export const deleteManyCollections = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/collections/bulk", { ids })
}

export const exportCollections = async (
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
    await tenantApiClient.post<ApiResponse<void>>("/collections/export", body)
    return
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

export const importCollections = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append("file", file)
  await tenantApiClient.upload<ApiResponse<void>>(
    "/collections/import",
    formData
  )
}
