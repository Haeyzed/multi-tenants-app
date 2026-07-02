import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  bulkUploadMedia,
  bulkUpdateMedia,
  copyMedia,
  copyMediaItem,
  deleteManyMedia,
  deleteMedia,
  getMedia,
  getMediaPaginated,
  getMediaStatistics,
  moveMedia,
  moveMediaItem,
  updateMedia,
  uploadMedia,
} from "@/lib/services/tenant/media-service"
import {
  createMediaFolder,
  deleteManyMediaFolders,
  deleteMediaFolder,
  getMediaFolderTree,
  getMediaFolders,
  updateMediaFolder,
} from "@/lib/services/tenant/media-folder-service"
import type {
  MediaFolderFormPayload,
  MediaFolderListParams,
  MediaListParams,
} from "@/types/tenant/media"

export const useGetMediaPaginated = (params?: MediaListParams) => {
  return useQuery({
    queryKey: ["media", params],
    queryFn: () => getMediaPaginated(params),
  })
}

export const useGetMedia = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ["media", id],
    queryFn: () => getMedia(id),
    enabled: enabled && id > 0,
  })
}

export const useGetMediaStatistics = () => {
  return useQuery({
    queryKey: ["media-statistics"],
    queryFn: () => getMediaStatistics(),
  })
}

export const useGetMediaFolderTree = (enabled = true) => {
  return useQuery({
    queryKey: ["media-folders", "tree"],
    queryFn: () => getMediaFolderTree(),
    enabled,
  })
}

export const useGetMediaFolders = (params?: MediaFolderListParams) => {
  return useQuery({
    queryKey: ["media-folders", "list", params],
    queryFn: () => getMediaFolders(params),
  })
}

export const useUploadMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      file,
      meta,
    }: {
      file: File
      meta?: { folder_id?: number | null; title?: string; alt_text?: string }
    }) => uploadMedia(file, meta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
      queryClient.invalidateQueries({ queryKey: ["media-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
    },
  })
}

export const useBulkUploadMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      files,
      meta,
    }: {
      files: File[]
      meta?: { folder_id?: number | null; title?: string; alt_text?: string }
    }) => bulkUploadMedia(files, meta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
      queryClient.invalidateQueries({ queryKey: ["media-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
    },
  })
}

export const useUpdateMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: {
        title?: string
        alt_text?: string | null
        folder_id?: number | null
      }
    }) => updateMedia(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
    },
  })
}

export const useMoveMediaItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      folderId,
    }: {
      id: number
      folderId: number | null
    }) => moveMediaItem(id, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
    },
  })
}

export const useCopyMediaItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      folderId,
    }: {
      id: number
      folderId: number | null
    }) => copyMediaItem(id, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
      queryClient.invalidateQueries({ queryKey: ["media-statistics"] })
    },
  })
}

export const useMoveMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      ids,
      folderId,
    }: {
      ids: number[]
      folderId: number | null
    }) => moveMedia(ids, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
    },
  })
}

export const useCopyMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      ids,
      folderId,
    }: {
      ids: number[]
      folderId: number | null
    }) => copyMedia(ids, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
    },
  })
}

export const useBulkUpdateMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      ids,
      payload,
    }: {
      ids: number[]
      payload: { title?: string; alt_text?: string | null }
    }) => bulkUpdateMedia(ids, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
    },
  })
}

export const useDeleteMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
      queryClient.invalidateQueries({ queryKey: ["media-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
    },
  })
}

export const useDeleteManyMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyMedia(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
      queryClient.invalidateQueries({ queryKey: ["media-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
    },
  })
}

export const useCreateMediaFolder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: MediaFolderFormPayload) => createMediaFolder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
    },
  })
}

export const useUpdateMediaFolder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<MediaFolderFormPayload>
    }) => updateMediaFolder(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
    },
  })
}

export const useDeleteMediaFolder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteMediaFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
    },
  })
}

export const useDeleteManyMediaFolders = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyMediaFolders(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })
    },
  })
}
