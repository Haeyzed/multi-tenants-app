import {
  MediaFolder,
  MediaFolderFormPayload,
  MediaFolderListParams,
  MediaFolderTreeNode,
} from "@/types/tenant/media"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { copyMedia, getMediaPaginated } from "./media-service"
import { tenantApiClient } from "./api-client"

export const getMediaFolderTree = async (): Promise<{
  tree: MediaFolderTreeNode[]
}> => {
  const response = await tenantApiClient.get<
    ApiResponse<{ tree: MediaFolderTreeNode[] }>
  >("/media-folders/tree")
  return response.data
}

export const getMediaFolders = async (
  params: MediaFolderListParams = {}
): Promise<MediaFolder[]> => {
  const query: Record<string, string | undefined> = {}

  if (params.search) {
    query.search = params.search
  }

  if (params.parent_id !== undefined) {
    query.parent_id = params.parent_id === null ? "" : String(params.parent_id)
  }

  const response = await tenantApiClient.get<ApiResponse<MediaFolder[]>>(
    "/media-folders",
    query
  )
  return response.data
}

export const createMediaFolder = async (
  payload: MediaFolderFormPayload
): Promise<ApiMutationResult<MediaFolder>> => {
  const response = await tenantApiClient.post<ApiResponse<MediaFolder>>(
    "/media-folders",
    payload
  )
  return { data: response.data, message: response.message }
}

export const updateMediaFolder = async (
  id: number,
  payload: Partial<MediaFolderFormPayload>
): Promise<ApiMutationResult<MediaFolder>> => {
  const response = await tenantApiClient.put<ApiResponse<MediaFolder>>(
    `/media-folders/${id}`,
    payload
  )
  return { data: response.data, message: response.message }
}

export const deleteMediaFolder = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/media-folders/${id}`
  )
  return { data: null, message: response.message }
}

export const deleteManyMediaFolders = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/media-folders/bulk",
    {
      ids,
    }
  )
  return { data: null, message: response.message }
}

export const moveMediaFolder = async (
  id: number,
  parentId: number | null
): Promise<ApiMutationResult<MediaFolder>> =>
  updateMediaFolder(id, { parent_id: parentId })

export const copyMediaFolderShallow = async (
  folderId: number,
  folderName: string,
  targetParentId: number | null
): Promise<ApiMutationResult<MediaFolder>> => {
  const newFolderResult = await createMediaFolder({
    name: `${folderName} (copy)`,
    parent_id: targetParentId,
  })

  const media = await getMediaPaginated({
    folder_id: folderId,
    per_page: 500,
  })

  if (media.data.length > 0) {
    await copyMedia(
      media.data.map((item) => item.id),
      newFolderResult.data.id
    )
  }

  return newFolderResult
}
