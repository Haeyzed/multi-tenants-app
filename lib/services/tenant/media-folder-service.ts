import {
  MediaFolder,
  MediaFolderFormPayload,
  MediaFolderListParams,
  MediaFolderTreeNode,
} from "@/types/tenant/media"
import { copyMedia, getMediaPaginated } from "./media-service"
import { tenantApiClient } from "./api-client"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

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
): Promise<MediaFolder> => {
  const response = await tenantApiClient.post<ApiResponse<MediaFolder>>(
    "/media-folders",
    payload
  )
  return response.data
}

export const updateMediaFolder = async (
  id: number,
  payload: Partial<MediaFolderFormPayload>
): Promise<MediaFolder> => {
  const response = await tenantApiClient.put<ApiResponse<MediaFolder>>(
    `/media-folders/${id}`,
    payload
  )
  return response.data
}

export const deleteMediaFolder = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/media-folders/${id}`)
}

export const deleteManyMediaFolders = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/media-folders/bulk", { ids })
}

export const moveMediaFolder = async (
  id: number,
  parentId: number | null
): Promise<MediaFolder> => updateMediaFolder(id, { parent_id: parentId })

export const copyMediaFolderShallow = async (
  folderId: number,
  folderName: string,
  targetParentId: number | null
): Promise<MediaFolder> => {
  const newFolder = await createMediaFolder({
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
      newFolder.id
    )
  }

  return newFolder
}
