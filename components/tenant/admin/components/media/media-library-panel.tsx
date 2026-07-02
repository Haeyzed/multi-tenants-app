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
import { MediaFolderTree } from "@/components/tenant/admin/components/media/media-folder-tree"
import { MediaGrid } from "@/components/tenant/admin/components/media/media-grid"
import { MediaList } from "@/components/tenant/admin/components/media/media-list"
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
  useDeleteMedia,
  useDeleteMediaFolder,
  useGetMediaFolderTree,
  useGetMediaFolders,
  useGetMediaPaginated,
} from "@/hooks/tenant/use-media-query"
import type { MediaBrowserFolder, MediaItem } from "@/types/tenant/media"
import { useTenantAuth } from "@/lib/providers/tenant/tenant-auth-provider"

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
  const [moveDialogOpen, setMoveDialogOpen] = React.useState(false)
  const [copyDialogOpen, setCopyDialogOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [actionIds, setActionIds] = React.useState<number[]>([])
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
    mime_type: accept?.startsWith("image") ? "image" : undefined,
    root_only: folderId === null && !search,
  })
  const uploadMutation = useBulkUploadMedia()
  const deleteMediaMutation = useDeleteMedia()
  const deleteFolderMutation = useDeleteMediaFolder()

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
          onSuccess: (result) => {
            toast.success(`${result.uploaded} file(s) uploaded successfully`)
          },
          onError: (error) => {
            toast.error(error.message || "Failed to upload files")
          },
        }
      )
    },
    [folderId, uploadMutation]
  )

  const items = mediaQuery.data?.data ?? []
  const folders = search ? [] : (foldersQuery.data ?? [])
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

  function openMoveDialog(ids: number[]) {
    setActionIds(ids)
    setMoveDialogOpen(true)
  }

  function openCopyDialog(ids: number[]) {
    setActionIds(ids)
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

  const browserProps = {
    folders,
    items,
    mode,
    selectedIds,
    pickerValue,
    onOpenFolder: openFolder,
    onToggleSelect: toggleSelect,
    onPick,
    onMoveItem: canManage ? (id: number) => openMoveDialog([id]) : undefined,
    onCopyItem: canManage ? (id: number) => openCopyDialog([id]) : undefined,
    onDeleteItem: canManage ? handleDeleteItem : undefined,
    onRenameFolder: canManage
      ? (folder: MediaBrowserFolder) => setFolderEditTarget(folder)
      : undefined,
    onDeleteFolder: canManage
      ? (folder: MediaBrowserFolder) => setFolderDeleteTarget(folder)
      : undefined,
    onPreviewItem: (item: MediaItem) => setPreviewItem(item),
  }

  return (
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
                <button
                  type="button"
                  className="hover:text-foreground"
                  onClick={() => {
                    setFolderId(crumb.id)
                    setPage(1)
                    setSelectedIds([])
                  }}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

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

      <MediaMoveDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        ids={actionIds}
        mode="move"
        onSuccess={() => {
          setSelectedIds([])
          setActionIds([])
          setMoveDialogOpen(false)
        }}
      />

      <MediaMoveDialog
        open={copyDialogOpen}
        onOpenChange={setCopyDialogOpen}
        ids={actionIds}
        mode="copy"
        onSuccess={() => {
          setSelectedIds([])
          setActionIds([])
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
  )
}
