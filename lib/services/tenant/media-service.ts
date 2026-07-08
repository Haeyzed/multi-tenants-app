import { PaginatedResponse } from "@/types/central/pagination"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import {
  MediaBackgroundRemovalResponse,
  MediaBulkActionResponse,
  MediaBulkUploadResponse,
  MediaItem,
  MediaListParams,
  MediaStatistics,
} from "@/types/tenant/media"
import { tenantApiClient } from "./api-client"

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
  const response = await tenantApiClient.get<ApiResponse<MediaItem>>(
    `/media/${id}`
  )
  return normalizeMediaItem(response.data)
}

export const getMediaStatistics = async (): Promise<MediaStatistics> => {
  const response =
    await tenantApiClient.get<ApiResponse<MediaStatistics>>("/media/statistics")
  return response.data
}

export const uploadMedia = async (
  file: File,
  meta: { folder_id?: number | null; title?: string; alt_text?: string } = {}
): Promise<ApiMutationResult<MediaItem>> => {
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
  return {
    data: normalizeMediaItem(response.data),
    message: response.message,
  }
}

export const bulkUploadMedia = async (
  files: File[],
  meta: { folder_id?: number | null; title?: string; alt_text?: string } = {}
): Promise<ApiMutationResult<MediaBulkUploadResponse>> => {
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

  const response = await tenantApiClient.upload<
    ApiResponse<MediaBulkUploadResponse>
  >("/media/bulk-upload", formData)

  return {
    data: {
      ...response.data,
      items: response.data.items.map(normalizeMediaItem),
    },
    message: response.message,
  }
}

export const updateMedia = async (
  id: number,
  payload: {
    title?: string
    alt_text?: string | null
    folder_id?: number | null
  }
): Promise<ApiMutationResult<MediaItem>> => {
  const response = await tenantApiClient.put<ApiResponse<MediaItem>>(
    `/media/${id}`,
    payload
  )
  return {
    data: normalizeMediaItem(response.data),
    message: response.message,
  }
}

export const moveMedia = async (
  ids: number[],
  folderId: number | null
): Promise<ApiMutationResult<MediaBulkActionResponse>> => {
  const response = await tenantApiClient.post<
    ApiResponse<MediaBulkActionResponse>
  >("/media/move", { ids, folder_id: folderId })
  return {
    data: {
      ...response.data,
      items: response.data.items?.map(normalizeMediaItem) ?? [],
    },
    message: response.message,
  }
}

export const moveMediaItem = async (
  id: number,
  folderId: number | null
): Promise<ApiMutationResult<MediaItem>> => {
  const response = await tenantApiClient.post<ApiResponse<MediaItem>>(
    `/media/${id}/move`,
    { folder_id: folderId }
  )
  return {
    data: normalizeMediaItem(response.data),
    message: response.message,
  }
}

export const copyMedia = async (
  ids: number[],
  folderId: number | null
): Promise<ApiMutationResult<MediaBulkActionResponse>> => {
  const response = await tenantApiClient.post<
    ApiResponse<MediaBulkActionResponse>
  >("/media/copy", { ids, folder_id: folderId })
  return {
    data: {
      ...response.data,
      items: response.data.items?.map(normalizeMediaItem) ?? [],
    },
    message: response.message,
  }
}

export const copyMediaItem = async (
  id: number,
  folderId: number | null
): Promise<ApiMutationResult<MediaItem>> => {
  const response = await tenantApiClient.post<ApiResponse<MediaItem>>(
    `/media/${id}/copy`,
    { folder_id: folderId }
  )
  return {
    data: normalizeMediaItem(response.data),
    message: response.message,
  }
}

export const bulkUpdateMedia = async (
  ids: number[],
  payload: { title?: string; alt_text?: string | null }
): Promise<ApiMutationResult<MediaBulkActionResponse>> => {
  const response = await tenantApiClient.patch<
    ApiResponse<MediaBulkActionResponse>
  >("/media/bulk", { ids, ...payload })
  return { data: response.data, message: response.message }
}

export const deleteMedia = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/media/${id}`
  )
  return { data: null, message: response.message }
}

export const deleteManyMedia = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/media/bulk",
    { ids }
  )
  return { data: null, message: response.message }
}

export const importMediaFromUrl = async (payload: {
  url: string
  folder_id?: number | null
  title?: string
  alt_text?: string
}): Promise<ApiMutationResult<MediaItem>> => {
  const response = await tenantApiClient.post<ApiResponse<MediaItem>>(
    "/media/import-url",
    payload
  )
  return {
    data: normalizeMediaItem(response.data),
    message: response.message,
  }
}

export const removeMediaBackground = async (
  id: number
): Promise<ApiMutationResult<MediaBackgroundRemovalResponse>> => {
  const response = await tenantApiClient.post<
    ApiResponse<MediaItem | { status: "queued" }>
  >(`/media/${id}/remove-background`)

  if (
    response.data &&
    typeof response.data === "object" &&
    "status" in response.data &&
    response.data.status === "queued"
  ) {
    return {
      data: { status: "queued" },
      message: response.message,
    }
  }

  return {
    data: {
      status: "completed",
      item: normalizeMediaItem(response.data as MediaItem),
    },
    message: response.message,
  }
}
