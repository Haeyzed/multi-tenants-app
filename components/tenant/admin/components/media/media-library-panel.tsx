"use client"

import {
  ChevronRightIcon,
  CopyIcon,
  FolderInputIcon,
  FolderPlusIcon,
  LayoutGridIcon,
  LinkIcon,
  ListIcon,
  SearchIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { MediaBulkDeleteDialog } from "@/components/tenant/admin/components/media/media-bulk-delete-dialog"
import { MediaFolderDeleteDialog } from "@/components/tenant/admin/components/media/media-folder-delete-dialog"
import { MediaFolderFormDialog } from "@/components/tenant/admin/components/media/media-folder-form-dialog"
import { MediaImportUrlDialog } from "@/components/tenant/admin/components/media/media-import-url-dialog"
import { MediaPreviewDialog } from "@/components/tenant/admin/components/media/media-preview-dialog"
import { MediaPropertiesDialog } from "@/components/tenant/admin/components/media/media-properties-dialog"
import { MediaFolderTree } from "@/components/tenant/admin/components/media/media-folder-tree"
import { MediaGrid } from "@/components/tenant/admin/components/media/media-grid"
import { MediaList } from "@/components/tenant/admin/components/media/media-list"
import {
  MediaLibraryDndProvider,
  MediaLibraryFolderDropTarget,
  mediaDragId,
} from "@/components/tenant/admin/components/media/media-library-dnd"
import { MediaMoveDialog } from "@/components/tenant/admin/components/media/media-move-dialog"
import {
  MediaUploadTrigger,
  MediaUploadZone,
} from "@/components/tenant/admin/components/media/media-upload-zone"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  useBulkUploadMedia,
  useCopyMediaFolder,
  useCopyMediaItem,
  useDeleteMedia,
  useDeleteMediaFolder,
  useGetMediaFolderTree,
  useGetMediaFolders,
  useGetMediaPaginated,
  useMoveMediaFolder,
  useMoveMediaItem,
  useRemoveMediaBackground,
} from "@/hooks/tenant/use-media-query"
import type {
  MediaBrowserFolder,
  MediaFolder,
  MediaFolderTreeNode,
  MediaItem,
} from "@/types/tenant/media"
import { isInvalidFolderDropTarget } from "@/lib/tenant/media-folder-tree-utils"
import { useTenantAuth } from "@/lib/providers/tenant/tenant-auth-provider"
import { useQueryClient } from "@tanstack/react-query"

type ViewMode = "grid" | "list"

function ActionToolbar({
  mode,
  viewMode,
  selectedCount,
  uploadPending,
  onViewModeChange,
  onMove,
  onCopy,
  onDelete,
  onImportUrl,
  canUpload,
}: {
  mode: "manage" | "picker"
  viewMode: ViewMode
  selectedCount: number
  uploadPending: boolean
  onViewModeChange: (value: ViewMode) => void
  onMove: () => void
  onCopy: () => void
  onDelete: () => void
  onImportUrl: () => void
  canUpload: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {mode === "manage" && selectedCount > 0 ? (
        <>
          <Button type="button" variant="outline" size="sm" onClick={onMove}>
            <FolderInputIcon />
            Move ({selectedCount})
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCopy}>
            <CopyIcon />
            Copy ({selectedCount})
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onDelete}
          >
            <Trash2Icon />
            Delete ({selectedCount})
          </Button>
        </>
      ) : null}

      <ToggleGroup
        value={[viewMode]}
        onValueChange={(values) => {
          const next = values[0] as ViewMode | undefined
          if (next) onViewModeChange(next)
        }}
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <LayoutGridIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          <ListIcon />
        </ToggleGroupItem>
      </ToggleGroup>

      {canUpload ? (
        <>
          <Button type="button" variant="outline" size="sm" onClick={onImportUrl}>
            <LinkIcon />
            Import URL
          </Button>
          <MediaUploadTrigger>
            {uploadPending ? <Spinner /> : <UploadIcon />}
            Upload
          </MediaUploadTrigger>
        </>
      ) : null}
    </div>
  )
}

interface MediaLibraryPanelProps {
  mode?: "manage" | "picker"
  pickerValue?: number | null
  onPick?: (item: MediaItem) => void
  accept?: string
  className?: string
}

export function MediaLibraryPanel({
  mode = "manage",
  pickerValue = null,
  onPick,
  accept,
  className,
}: MediaLibraryPanelProps) {
  const { hasPermission, isStoreOwner } = useTenantAuth()
  const queryClient = useQueryClient()
  const canManage = isStoreOwner || hasPermission("settings.update")
  const [folderId, setFolderId] = React.useState<number | null>(null)
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")
  const [selectedIds, setSelectedIds] = React.useState<number[]>([])
  const [folderDialogOpen, setFolderDialogOpen] = React.useState(false)
  const [folderEditTarget, setFolderEditTarget] =
    React.useState<MediaBrowserFolder | null>(null)
  const [folderDeleteTarget, setFolderDeleteTarget] =
    React.useState<MediaBrowserFolder | null>(null)
  const [importUrlOpen, setImportUrlOpen] = React.useState(false)
  const [previewItem, setPreviewItem] = React.useState<MediaItem | null>(null)
  const [propertiesItem, setPropertiesItem] = React.useState<MediaItem | null>(
    null
  )
  const [processingItemId, setProcessingItemId] = React.useState<number | null>(
    null
  )
  const pollIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(
    null
  )
  const [moveDialogOpen, setMoveDialogOpen] = React.useState(false)
  const [copyDialogOpen, setCopyDialogOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [actionIds, setActionIds] = React.useState<number[]>([])
  const [actionFolders, setActionFolders] = React.useState<MediaBrowserFolder[]>(
    []
  )
  const perPage = 24

  const treeQuery = useGetMediaFolderTree()
  const foldersQuery = useGetMediaFolders(
    search
      ? { search }
      : { parent_id: folderId }
  )
  const mediaQuery = useGetMediaPaginated({
    page,
    per_page: perPage,
    search: search || undefined,
    folder_id: folderId ?? undefined,
  })
  const uploadMutation = useBulkUploadMedia()
  const deleteMediaMutation = useDeleteMedia()
  const deleteFolderMutation = useDeleteMediaFolder()
  const removeBackgroundMutation = useRemoveMediaBackground()
  const moveMediaItemMutation = useMoveMediaItem()
  const copyMediaItemMutation = useCopyMediaItem()
  const moveMediaFolderMutation = useMoveMediaFolder()
  const copyMediaFolderMutation = useCopyMediaFolder()

  React.useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  function startMediaPolling() {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }

    let elapsed = 0

    pollIntervalRef.current = setInterval(() => {
      elapsed += 3000
      queryClient.invalidateQueries({ queryKey: ["media"] })
      queryClient.invalidateQueries({ queryKey: ["media-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["media-folders"] })

      if (elapsed >= 60000 && pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }, 3000)
  }

  const breadcrumb = React.useMemo(() => {
    const tree = treeQuery.data?.tree ?? []

    function findPath(
      nodes: typeof tree,
      targetId: number | null,
      trail: Array<{ id: number | null; name: string }> = [
        { id: null, name: "Library" },
      ]
    ): Array<{ id: number | null; name: string }> | null {
      if (targetId === null) return trail

      for (const node of nodes) {
        if (node.id === targetId) {
          return [...trail, { id: node.id, name: node.name }]
        }

        const childPath = findPath(node.children, targetId, [
          ...trail,
          { id: node.id, name: node.name },
        ])

        if (childPath) return childPath
      }

      return null
    }

    return findPath(tree, folderId) ?? [{ id: null, name: "Library" }]
  }, [folderId, treeQuery.data?.tree])

  const handleFilesSelected = React.useCallback(
    (files: File[]) => {
      uploadMutation.mutate(
        { files, meta: { folder_id: folderId } },
        {
          onSuccess: async (result) => {
            setPage(1)
            setSelectedIds([])
            await queryClient.refetchQueries({ queryKey: ["media"] })
            toast.success(`${result.uploaded} file(s) uploaded successfully`)
          },
          onError: (error) => {
            toast.error(error.message || "Failed to upload files")
          },
        }
      )
    },
    [folderId, queryClient, uploadMutation]
  )

  const items: MediaItem[] = mediaQuery.data?.data ?? []
  const folders: MediaBrowserFolder[] = search
    ? []
    : (foldersQuery.data ?? []).map((folder: MediaFolder) => ({
        id: folder.id,
        name: folder.name,
        parent_id: folder.parent_id,
        media_count: folder.media_count ?? 0,
      }))
  const pageCount = mediaQuery.data?.meta.last_page ?? 1
  const isLoading = mediaQuery.isLoading || foldersQuery.isLoading

  function toggleSelect(id: number) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  }

  function openFolder(nextFolderId: number) {
    setFolderId(nextFolderId)
    setPage(1)
    setSelectedIds([])
  }

  function openMoveDialog(
    mediaIds: number[],
    foldersToMove: MediaBrowserFolder[] = []
  ) {
    setActionIds(mediaIds)
    setActionFolders(foldersToMove)
    setMoveDialogOpen(true)
  }

  function openCopyDialog(
    mediaIds: number[],
    foldersToCopy: MediaBrowserFolder[] = []
  ) {
    setActionIds(mediaIds)
    setActionFolders(foldersToCopy)
    setCopyDialogOpen(true)
  }

  function openDeleteDialog(ids: number[]) {
    setActionIds(ids)
    setDeleteOpen(true)
  }

  function handleDeleteItem(id: number) {
    deleteMediaMutation.mutate(id, {
      onSuccess: () => toast.success("File deleted successfully"),
      onError: (error) => toast.error(error.message || "Failed to delete file"),
    })
  }

  function handleDeleteFolder() {
    if (!folderDeleteTarget) return

    deleteFolderMutation.mutate(folderDeleteTarget.id, {
      onSuccess: () => {
        toast.success("Folder deleted successfully")
        if (folderId === folderDeleteTarget.id) {
          setFolderId(null)
          setPage(1)
        }
        setFolderDeleteTarget(null)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete folder")
      },
    })
  }

  function handleRemoveBackground(item: MediaItem) {
    setProcessingItemId(item.id)

    removeBackgroundMutation.mutate(item.id, {
      onSuccess: (result) => {
        if (result.status === "queued") {
          toast.success(
            "Background removal started. The new file will appear shortly."
          )
          startMediaPolling()
          return
        }

        toast.success("Background removed successfully")
      },
      onError: (error) => {
        toast.error(error.message || "Failed to remove background")
      },
      onSettled: () => {
        setProcessingItemId(null)
      },
    })
  }

  function treeNodeToBrowserFolder(node: MediaFolderTreeNode): MediaBrowserFolder {
    return {
      id: node.id,
      name: node.name,
      parent_id: node.parent_id,
      media_count: node.media_count,
    }
  }

  const dragLabels = React.useMemo(() => {
    const labels = new Map<string, string>()

    folders.forEach((folder) => {
      labels.set(mediaDragId("folder", folder.id), folder.name)
    })

    items.forEach((item) => {
      labels.set(mediaDragId("media", item.id), item.title ?? item.name)
    })

    return labels
  }, [folders, items])

  const draggableIds = React.useMemo(
    () => [
      ...folders.map((folder) => mediaDragId("folder", folder.id)),
      ...items.map((item) => mediaDragId("media", item.id)),
    ],
    [folders, items]
  )

  const handleLibraryDrop = React.useCallback(
    async ({
      payload,
      targetFolderId,
      copy,
    }: {
      payload: { kind: "media" | "folder"; id: number }
      targetFolderId: number | null
      copy: boolean
    }) => {
      const tree = treeQuery.data?.tree ?? []

      if (payload.kind === "folder") {
        if (isInvalidFolderDropTarget(payload.id, targetFolderId, tree)) {
          toast.error("Cannot move a folder into itself or a subfolder")
          return
        }

        const folder = folders.find((entry) => entry.id === payload.id)

        if (!folder) {
          return
        }

        if (!copy && folder.parent_id === targetFolderId) {
          return
        }

        try {
          if (copy) {
            await copyMediaFolderMutation.mutateAsync({
              id: folder.id,
              name: folder.name,
              parentId: targetFolderId,
            })
            toast.success("Folder copied successfully")
          } else {
            await moveMediaFolderMutation.mutateAsync({
              id: folder.id,
              parentId: targetFolderId,
            })
            toast.success("Folder moved successfully")
          }
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Unable to move folder"
          )
        }

        return
      }

      const item = items.find((entry) => entry.id === payload.id)

      if (!item) {
        return
      }

      if (!copy && item.folder_id === targetFolderId) {
        return
      }

      try {
        if (copy) {
          await copyMediaItemMutation.mutateAsync({
            id: item.id,
            folderId: targetFolderId,
          })
          toast.success("File copied successfully")
        } else {
          await moveMediaItemMutation.mutateAsync({
            id: item.id,
            folderId: targetFolderId,
          })
          toast.success("File moved successfully")
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to move file"
        )
      }
    },
    [
      copyMediaFolderMutation,
      copyMediaItemMutation,
      folders,
      items,
      moveMediaFolderMutation,
      moveMediaItemMutation,
      treeQuery.data?.tree,
    ]
  )

  const browserProps = {
    folders,
    items,
    mode,
    accept,
    selectedIds,
    pickerValue,
    onOpenFolder: openFolder,
    onToggleSelect: toggleSelect,
    onPick,
    onMoveItem: canManage ? (id: number) => openMoveDialog([id]) : undefined,
    onCopyItem: canManage ? (id: number) => openCopyDialog([id]) : undefined,
    onMoveFolder: canManage
      ? (folder: MediaBrowserFolder) => openMoveDialog([], [folder])
      : undefined,
    onCopyFolder: canManage
      ? (folder: MediaBrowserFolder) => openCopyDialog([], [folder])
      : undefined,
    enableDrag: canManage && mode === "manage",
    onDeleteItem: canManage ? handleDeleteItem : undefined,
    onRenameFolder: canManage
      ? (folder: MediaBrowserFolder) => setFolderEditTarget(folder)
      : undefined,
    onDeleteFolder: canManage
      ? (folder: MediaBrowserFolder) => setFolderDeleteTarget(folder)
      : undefined,
    onPreviewItem: (item: MediaItem) => setPreviewItem(item),
    onViewProperties: (item: MediaItem) => setPropertiesItem(item),
    onRemoveBackground: canManage ? handleRemoveBackground : undefined,
    processingItemId,
  }

  return (
    <MediaLibraryDndProvider
      enabled={canManage && mode === "manage"}
      draggableIds={draggableIds}
      strategy={viewMode === "list" ? "list" : "grid"}
      onDrop={handleLibraryDrop}
      renderOverlay={(payload) =>
        dragLabels.get(mediaDragId(payload.kind, payload.id)) ??
        (payload.kind === "folder" ? "Folder" : "File")
      }
    >
      <div className={className}>
      <div className="flex flex-col gap-4 lg:flex-row">
        <aside className="w-full shrink-0 rounded-lg border bg-card p-3 lg:w-64">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Folders</p>
            <TenantAdminAuthGuard permissions="settings.update">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFolderDialogOpen(true)}
              >
                <FolderPlusIcon className="size-4" />
                New folder
              </Button>
            </TenantAdminAuthGuard>
          </div>
          {treeQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <MediaFolderTree
              tree={treeQuery.data?.tree ?? []}
              selectedFolderId={folderId}
              enableDropTargets={canManage && mode === "manage"}
              onRenameFolder={
                canManage
                  ? (node) => setFolderEditTarget(treeNodeToBrowserFolder(node))
                  : undefined
              }
              onDeleteFolder={
                canManage
                  ? (node) =>
                      setFolderDeleteTarget(treeNodeToBrowserFolder(node))
                  : undefined
              }
              onMoveFolder={
                canManage
                  ? (node) =>
                      openMoveDialog([], [treeNodeToBrowserFolder(node)])
                  : undefined
              }
              onCopyFolder={
                canManage
                  ? (node) =>
                      openCopyDialog([], [treeNodeToBrowserFolder(node)])
                  : undefined
              }
              onSelectFolder={(nextFolderId) => {
                setFolderId(nextFolderId)
                setPage(1)
                setSelectedIds([])
              }}
            />
          )}
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            {breadcrumb.map((crumb, index) => (
              <React.Fragment key={`${crumb.id ?? "root"}-${index}`}>
                {index > 0 ? (
                  <ChevronRightIcon className="size-3.5 shrink-0" />
                ) : null}
                <MediaLibraryFolderDropTarget folderId={crumb.id}>
                  <button
                    type="button"
                    className="rounded px-1 hover:text-foreground"
                    onClick={() => {
                      setFolderId(crumb.id)
                      setPage(1)
                      setSelectedIds([])
                    }}
                  >
                    {crumb.name}
                  </button>
                </MediaLibraryFolderDropTarget>
              </React.Fragment>
            ))}
          </div>

          {canManage && mode === "manage" ? (
            <p className="mb-2 text-xs text-muted-foreground">
              Drag files or folders onto a folder to move. Hold Alt or Ctrl while
              dropping to copy.
            </p>
          ) : null}

          <MediaUploadZone
            accept={accept}
            disabled={!canManage}
            uploadPending={uploadMutation.isPending}
            onFilesSelected={handleFilesSelected}
            className="space-y-4"
            header={
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-md flex-1">
                  <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value)
                      setPage(1)
                    }}
                    placeholder="Search files..."
                    className="ps-9"
                  />
                </div>

                <ActionToolbar
                  mode={mode}
                  viewMode={viewMode}
                  selectedCount={selectedIds.length}
                  uploadPending={uploadMutation.isPending}
                  onViewModeChange={setViewMode}
                  onMove={() => openMoveDialog(selectedIds)}
                  onCopy={() => openCopyDialog(selectedIds)}
                  onDelete={() => openDeleteDialog(selectedIds)}
                  onImportUrl={() => setImportUrlOpen(true)}
                  canUpload={canManage}
                />
              </div>
            }
          >
            {isLoading ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-md" />
                ))}
              </div>
            ) : viewMode === "list" ? (
              <MediaList {...browserProps} />
            ) : (
              <MediaGrid {...browserProps} />
            )}
          </MediaUploadZone>

          {pageCount > 1 ? (
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Page {page} of {pageCount}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= pageCount}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <MediaFolderFormDialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        parentId={folderId}
      />

      <MediaFolderFormDialog
        open={!!folderEditTarget}
        onOpenChange={(open) => {
          if (!open) setFolderEditTarget(null)
        }}
        folder={folderEditTarget}
      />

      <MediaFolderDeleteDialog
        open={!!folderDeleteTarget}
        onOpenChange={(open) => {
          if (!open) setFolderDeleteTarget(null)
        }}
        folder={folderDeleteTarget}
        onConfirm={handleDeleteFolder}
        isDeleting={deleteFolderMutation.isPending}
      />

      <MediaImportUrlDialog
        open={importUrlOpen}
        onOpenChange={setImportUrlOpen}
        folderId={folderId}
      />

      <MediaPreviewDialog
        open={!!previewItem}
        onOpenChange={(open) => {
          if (!open) setPreviewItem(null)
        }}
        item={previewItem}
      />

      <MediaPropertiesDialog
        open={!!propertiesItem}
        onOpenChange={(open) => {
          if (!open) setPropertiesItem(null)
        }}
        item={propertiesItem}
      />

      <MediaMoveDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        mediaIds={actionIds}
        folders={actionFolders}
        mode="move"
        onSuccess={() => {
          setSelectedIds([])
          setActionIds([])
          setActionFolders([])
          setMoveDialogOpen(false)
        }}
      />

      <MediaMoveDialog
        open={copyDialogOpen}
        onOpenChange={setCopyDialogOpen}
        mediaIds={actionIds}
        folders={actionFolders}
        mode="copy"
        onSuccess={() => {
          setSelectedIds([])
          setActionIds([])
          setActionFolders([])
          setCopyDialogOpen(false)
        }}
      />

      <MediaBulkDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        ids={actionIds}
        onSuccess={() => {
          setSelectedIds([])
          setActionIds([])
        }}
      />
    </div>
    </MediaLibraryDndProvider>
  )
}
