import { PaginatedResponse } from "@/types/central/pagination"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import {
  MediaBulkActionResponse,
  MediaBulkUploadResponse,
  MediaItem,
  MediaListParams,
  MediaStatistics,
} from "@/types/tenant/media"
import { tenantApiClient } from "./api-client"

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

function normalizeMediaItem(item: MediaItem): MediaItem {
  return {
    ...item,
    url: resolveTenantMediaUrl(item),
  }
}

function buildMediaQueryParams(
  params: MediaListParams = {}
): Record<string, string | number | boolean | undefined> {
  const query: Record<string, string | number | boolean | undefined> = {
    page: params.page,
    per_page: params.per_page,
    search: params.search,
    mime_type: params.mime_type,
    root_only: params.root_only,
  }

  if (params.folder_id != null) {
    query.folder_id = params.folder_id
  }

  return query
}

export const getMediaPaginated = async (
  params: MediaListParams = {}
): Promise<PaginatedResponse<MediaItem>> => {
  const response = await tenantApiClient.get<ApiResponse<MediaItem[]>>(
    "/media",
    buildMediaQueryParams(params)
  )

  return {
    data: response.data.map(normalizeMediaItem),
    meta: response.meta || {
      current_page: 1,
      last_page: 1,
      per_page: params.per_page || 24,
      total: response.data.length,
    },
  }
}

export const getMedia = async (id: number): Promise<MediaItem> => {
  const response = await tenantApiClient.get<ApiResponse<MediaItem>>(`/media/${id}`)
  return normalizeMediaItem(response.data)
}

export const getMediaStatistics = async (): Promise<MediaStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<MediaStatistics>>(
    "/media/statistics"
  )
  return response.data
}

export const uploadMedia = async (
  file: File,
  meta: { folder_id?: number | null; title?: string; alt_text?: string } = {}
): Promise<MediaItem> => {
  const formData = new FormData()
  formData.append("file", file)

  if (meta.folder_id != null) {
    formData.append("folder_id", String(meta.folder_id))
  }

  if (meta.title) {
    formData.append("title", meta.title)
  }

  if (meta.alt_text) {
    formData.append("alt_text", meta.alt_text)
  }

  const response = await tenantApiClient.upload<ApiResponse<MediaItem>>(
    "/media",
    formData
  )
  return normalizeMediaItem(response.data)
}

export const bulkUploadMedia = async (
  files: File[],
  meta: { folder_id?: number | null; title?: string; alt_text?: string } = {}
): Promise<MediaBulkUploadResponse> => {
  const formData = new FormData()

  for (const file of files) {
    formData.append("files[]", file)
  }

  if (meta.folder_id != null) {
    formData.append("folder_id", String(meta.folder_id))
  }

  if (meta.title) {
    formData.append("title", meta.title)
  }

  if (meta.alt_text) {
    formData.append("alt_text", meta.alt_text)
  }

  const response = await tenantApiClient.upload<ApiResponse<MediaBulkUploadResponse>>(
    "/media/bulk-upload",
    formData
  )

  return {
    ...response.data,
    items: response.data.items.map(normalizeMediaItem),
  }
}

export const updateMedia = async (
  id: number,
  payload: { title?: string; alt_text?: string | null; folder_id?: number | null }
): Promise<MediaItem> => {
  const response = await tenantApiClient.put<ApiResponse<MediaItem>>(
    `/media/${id}`,
    payload
  )
  return normalizeMediaItem(response.data)
}

export const moveMedia = async (
  ids: number[],
  folderId: number | null
): Promise<MediaBulkActionResponse> => {
  const response = await tenantApiClient.post<ApiResponse<MediaBulkActionResponse>>(
    "/media/move",
    { ids, folder_id: folderId }
  )
  return {
    ...response.data,
    items: response.data.items?.map(normalizeMediaItem) ?? [],
  }
}

export const moveMediaItem = async (
  id: number,
  folderId: number | null
): Promise<MediaItem> => {
  const response = await tenantApiClient.post<ApiResponse<MediaItem>>(
    `/media/${id}/move`,
    { folder_id: folderId }
  )
  return normalizeMediaItem(response.data)
}

export const copyMedia = async (
  ids: number[],
  folderId: number | null
): Promise<MediaBulkActionResponse> => {
  const response = await tenantApiClient.post<ApiResponse<MediaBulkActionResponse>>(
    "/media/copy",
    { ids, folder_id: folderId }
  )
  return {
    ...response.data,
    items: response.data.items?.map(normalizeMediaItem) ?? [],
  }
}

export const copyMediaItem = async (
  id: number,
  folderId: number | null
): Promise<MediaItem> => {
  const response = await tenantApiClient.post<ApiResponse<MediaItem>>(
    `/media/${id}/copy`,
    { folder_id: folderId }
  )
  return normalizeMediaItem(response.data)
}

export const bulkUpdateMedia = async (
  ids: number[],
  payload: { title?: string; alt_text?: string | null }
): Promise<MediaBulkActionResponse> => {
  const response = await tenantApiClient.patch<ApiResponse<MediaBulkActionResponse>>(
    "/media/bulk",
    { ids, ...payload }
  )
  return response.data
}

export const deleteMedia = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/media/${id}`)
}

export const deleteManyMedia = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/media/bulk", { ids })
}
