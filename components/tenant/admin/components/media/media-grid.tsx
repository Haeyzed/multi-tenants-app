"use client"

import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FolderInputIcon,
  FolderIcon,
  GripVerticalIcon,
  ImageIcon,
  InfoIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { downloadMediaItem } from "@/lib/tenant/media-download"
import {
  getMediaFileExtension,
  isMediaImage,
  isMediaPreviewable,
  mediaMatchesAccept,
} from "@/lib/tenant/media-file-kind"
import type { MediaBrowserFolder, MediaItem } from "@/types/tenant/media"
import { MediaAiContextMenuSub,
  MediaAiDropdownMenuSub,
} from "@/components/tenant/admin/components/media/media-ai-features-menu"
import {
  MediaLibraryDraggable,
  MediaLibraryDragHandle,
  MediaLibraryFolderDropTarget,
} from "@/components/tenant/admin/components/media/media-library-dnd"
import { MediaFileIcon } from "@/components/tenant/admin/components/shared/media-file-icon"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

function runMenuAction(action: () => void) {
  return (event: { preventDefault: () => void; stopPropagation: () => void }) => {
    event.preventDefault()
    event.stopPropagation()
    action()
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export type { MediaBrowserFolder }

interface MediaGridProps {
  folders: MediaBrowserFolder[]
  items: MediaItem[]
  mode: "manage" | "picker"
  accept?: string
  selectedIds: number[]
  pickerValue?: number | null
  onOpenFolder?: (folderId: number) => void
  onToggleSelect?: (id: number) => void
  onPick?: (item: MediaItem) => void
  onMoveItem?: (id: number) => void
  onCopyItem?: (id: number) => void
  onDeleteItem?: (id: number) => void
  onPreviewItem?: (item: MediaItem) => void
  onViewProperties?: (item: MediaItem) => void
  onRemoveBackground?: (item: MediaItem) => void
  processingItemId?: number | null
  onRenameFolder?: (folder: MediaBrowserFolder) => void
  onDeleteFolder?: (folder: MediaBrowserFolder) => void
  onMoveFolder?: (folder: MediaBrowserFolder) => void
  onCopyFolder?: (folder: MediaBrowserFolder) => void
  enableDrag?: boolean
}

function MediaFileActions({
  item,
  onMoveItem,
  onCopyItem,
  onDeleteItem,
  onPreviewItem,
  onViewProperties,
  onRemoveBackground,
  processingItemId,
}: {
  item: MediaItem
  onMoveItem?: (id: number) => void
  onCopyItem?: (id: number) => void
  onDeleteItem?: (id: number) => void
  onPreviewItem?: (item: MediaItem) => void
  onViewProperties?: (item: MediaItem) => void
  onRemoveBackground?: (item: MediaItem) => void
  processingItemId?: number | null
}) {
  if (
    !onMoveItem &&
    !onCopyItem &&
    !onDeleteItem &&
    !onPreviewItem &&
    !onViewProperties &&
    !onRemoveBackground
  ) {
    return null
  }

  const canPreview = isMediaPreviewable(item)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute inset-e-1 top-1 size-7 bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-40">
        {canPreview && onPreviewItem ? (
          <DropdownMenuItem onClick={() => onPreviewItem(item)}>
            <EyeIcon />
            Open
          </DropdownMenuItem>
        ) : null}
        {onViewProperties ? (
          <DropdownMenuItem onClick={() => onViewProperties(item)}>
            <InfoIcon />
            Properties
          </DropdownMenuItem>
        ) : null}
        {onMoveItem ? (
          <DropdownMenuItem onClick={runMenuAction(() => onMoveItem(item.id))}>
            <FolderInputIcon />
            Move
          </DropdownMenuItem>
        ) : null}
        {onCopyItem ? (
          <DropdownMenuItem onClick={runMenuAction(() => onCopyItem(item.id))}>
            <CopyIcon />
            Copy
          </DropdownMenuItem>
        ) : null}
        <MediaAiDropdownMenuSub
          item={item}
          onRemoveBackground={onRemoveBackground}
          processingItemId={processingItemId}
        />
        <DropdownMenuItem onClick={() => downloadMediaItem(item)}>
          <DownloadIcon />
          Download
        </DropdownMenuItem>
        {onDeleteItem ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDeleteItem(item.id)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function FileContextMenuItems({
  item,
  onMoveItem,
  onCopyItem,
  onDeleteItem,
  onPreviewItem,
  onViewProperties,
  onRemoveBackground,
  processingItemId,
}: {
  item: MediaItem
  onMoveItem?: (id: number) => void
  onCopyItem?: (id: number) => void
  onDeleteItem?: (id: number) => void
  onPreviewItem?: (item: MediaItem) => void
  onViewProperties?: (item: MediaItem) => void
  onRemoveBackground?: (item: MediaItem) => void
  processingItemId?: number | null
}) {
  const canPreview = isMediaPreviewable(item)

  return (
    <>
      {canPreview && onPreviewItem ? (
        <ContextMenuItem onClick={() => onPreviewItem(item)}>
          <EyeIcon />
          Open
        </ContextMenuItem>
      ) : null}
      {onViewProperties ? (
        <ContextMenuItem onClick={() => onViewProperties(item)}>
          <InfoIcon />
          Properties
        </ContextMenuItem>
      ) : null}
      {onMoveItem ? (
        <ContextMenuItem onClick={runMenuAction(() => onMoveItem(item.id))}>
          <FolderInputIcon />
          Move
        </ContextMenuItem>
      ) : null}
      {onCopyItem ? (
        <ContextMenuItem onClick={runMenuAction(() => onCopyItem(item.id))}>
          <CopyIcon />
          Copy
        </ContextMenuItem>
      ) : null}
      <MediaAiContextMenuSub
        item={item}
        onRemoveBackground={onRemoveBackground}
        processingItemId={processingItemId}
      />
      <ContextMenuItem onClick={() => downloadMediaItem(item)}>
        <DownloadIcon />
        Download
      </ContextMenuItem>
      {onDeleteItem ? (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onClick={() => onDeleteItem(item.id)}
          >
            <Trash2Icon />
            Delete
          </ContextMenuItem>
        </>
      ) : null}
    </>
  )
}

function FolderContextMenuItems({
  folder,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  onCopyFolder,
}: {
  folder: MediaBrowserFolder
  onRenameFolder?: (folder: MediaBrowserFolder) => void
  onDeleteFolder?: (folder: MediaBrowserFolder) => void
  onMoveFolder?: (folder: MediaBrowserFolder) => void
  onCopyFolder?: (folder: MediaBrowserFolder) => void
}) {
  if (!onRenameFolder && !onDeleteFolder && !onMoveFolder && !onCopyFolder) {
    return null
  }

  return (
    <>
      {onMoveFolder ? (
        <ContextMenuItem onClick={runMenuAction(() => onMoveFolder(folder))}>
          <FolderInputIcon />
          Move
        </ContextMenuItem>
      ) : null}
      {onCopyFolder ? (
        <ContextMenuItem onClick={runMenuAction(() => onCopyFolder(folder))}>
          <CopyIcon />
          Copy
        </ContextMenuItem>
      ) : null}
      {onRenameFolder ? (
        <ContextMenuItem onClick={runMenuAction(() => onRenameFolder(folder))}>
          <PencilIcon />
          Rename
        </ContextMenuItem>
      ) : null}
      {onDeleteFolder ? (
        <>
          {onRenameFolder || onMoveFolder || onCopyFolder ? (
            <ContextMenuSeparator />
          ) : null}
          <ContextMenuItem
            variant="destructive"
            onClick={runMenuAction(() => onDeleteFolder(folder))}
          >
            <Trash2Icon />
            Delete
          </ContextMenuItem>
        </>
      ) : null}
    </>
  )
}

export function MediaGrid({
  folders,
  items,
  mode,
  accept,
  selectedIds,
  pickerValue,
  onOpenFolder,
  onToggleSelect,
  onPick,
  onMoveItem,
  onCopyItem,
  onDeleteItem,
  onPreviewItem,
  onViewProperties,
  onRemoveBackground,
  processingItemId,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  onCopyFolder,
  enableDrag = false,
}: MediaGridProps) {
  const isEmpty = folders.length === 0 && items.length === 0
  const hasFolderMenu =
    onRenameFolder || onDeleteFolder || onMoveFolder || onCopyFolder

  if (isEmpty) {
    return (
      <div
        data-media-empty
        className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground"
      >
        <FolderIcon className="mb-3 size-8 text-muted-foreground/70" />
        <p className="font-medium text-foreground">This folder is empty</p>
        <p className="mt-1 max-w-xs">
          Upload files or create subfolders to organize your media library.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
      {folders.map((folder) => {
        const folderButton = (
          <button
            type="button"
            data-media-folder
            className="group relative w-full overflow-hidden rounded-md border bg-card text-left transition-colors hover:border-primary/40"
            onClick={() => onOpenFolder?.(folder.id)}
          >
            {enableDrag ? (
              <MediaLibraryDragHandle className="absolute inset-s-1 top-1 z-10 opacity-100">
                <GripVerticalIcon className="size-3.5" />
              </MediaLibraryDragHandle>
            ) : null}
            <div className="relative aspect-square bg-amber-500/10">
              <div className="flex size-full items-center justify-center">
                <FolderIcon className="size-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="space-y-0.5 p-2">
              <p className="truncate text-xs font-medium">{folder.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {folder.media_count ?? 0} files
              </p>
            </div>
          </button>
        )

        const folderTrigger = enableDrag ? (
          <MediaLibraryDraggable kind="folder" id={folder.id}>
            <MediaLibraryFolderDropTarget folderId={folder.id}>
              <ContextMenuTrigger render={folderButton} />
            </MediaLibraryFolderDropTarget>
          </MediaLibraryDraggable>
        ) : (
          <ContextMenuTrigger render={folderButton} />
        )

        if (mode !== "manage" || !hasFolderMenu) {
          return (
            <div key={`folder-${folder.id}`}>
              {enableDrag ? (
                <MediaLibraryDraggable kind="folder" id={folder.id}>
                  <MediaLibraryFolderDropTarget folderId={folder.id}>
                    {folderButton}
                  </MediaLibraryFolderDropTarget>
                </MediaLibraryDraggable>
              ) : (
                folderButton
              )}
            </div>
          )
        }

        return (
          <ContextMenu key={`folder-${folder.id}`}>
            {folderTrigger}
            <ContextMenuContent>
              <FolderContextMenuItems
                folder={folder}
                onRenameFolder={onRenameFolder}
                onDeleteFolder={onDeleteFolder}
                onMoveFolder={onMoveFolder}
                onCopyFolder={onCopyFolder}
              />
            </ContextMenuContent>
          </ContextMenu>
        )
      })}

      {items.map((item) => {
        const isImage = isMediaImage(item)
        const extension = getMediaFileExtension(item)
        const isPickable = mode !== "picker" || mediaMatchesAccept(item, accept)
        const isSelected =
          mode === "picker"
            ? pickerValue === item.id
            : selectedIds.includes(item.id)

        const tile = (
          <button
            type="button"
            data-media-item
            className={cn(
              "group relative w-full overflow-hidden rounded-md border bg-card text-left transition-colors hover:border-primary/40",
              isSelected && "border-primary ring-2 ring-primary/20",
              mode === "picker" && !isPickable && "cursor-not-allowed opacity-50"
            )}
            onClick={() => {
              if (mode === "picker") {
                if (!isPickable) {
                  return
                }
                onPick?.(item)
                return
              }

              onToggleSelect?.(item.id)
            }}
            onDoubleClick={(event) => {
              event.preventDefault()
              if (isMediaPreviewable(item)) {
                onPreviewItem?.(item)
              }
            }}
          >
            {enableDrag ? (
              <div className="absolute inset-s-1 top-1 z-10 flex items-center gap-0.5">
                <MediaLibraryDragHandle className="static opacity-100">
                  <GripVerticalIcon className="size-3.5" />
                </MediaLibraryDragHandle>
              </div>
            ) : null}
            <div className="relative aspect-square bg-muted/40">
              {isImage ? (
                <MediaThumbnail
                  media={item}
                  alt={item.alt_text ?? item.title ?? item.name}
                  cover
                  zoomable={mode === "manage"}
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <MediaFileIcon item={item} size="lg" />
                </div>
              )}

              {mode === "manage" ? (
                <>
                  <div
                    className={cn(
                      "absolute top-1 z-10 flex items-center gap-0.5",
                      enableDrag ? "inset-s-7" : "inset-s-1"
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect?.(item.id)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Select ${item.title ?? item.name}`}
                      className="size-4 bg-background/80"
                    />
                  </div>
                  <MediaFileActions
                    item={item}
                    onMoveItem={onMoveItem}
                    onCopyItem={onCopyItem}
                    onDeleteItem={onDeleteItem}
                    onPreviewItem={onPreviewItem}
                    onViewProperties={onViewProperties}
                    onRemoveBackground={onRemoveBackground}
                    processingItemId={processingItemId}
                  />
                </>
              ) : null}

              {mode === "picker" && isSelected ? (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                  <div className="rounded-full bg-primary p-1.5 text-primary-foreground">
                    <CheckIcon className="size-3.5" />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-0.5 p-2">
              <p className="truncate text-xs font-medium">
                {item.title ?? item.name}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                {isImage ? (
                  <ImageIcon className="size-3" />
                ) : extension ? (
                  <span className="uppercase">{extension}</span>
                ) : null}
                <span>{formatFileSize(item.size)}</span>
              </div>
            </div>
          </button>
        )

        const fileTrigger = enableDrag ? (
          <MediaLibraryDraggable kind="media" id={item.id}>
            <ContextMenuTrigger render={tile} />
          </MediaLibraryDraggable>
        ) : (
          <ContextMenuTrigger render={tile} />
        )

        if (mode !== "manage") {
          return (
            <div key={item.id}>
              {enableDrag ? (
                <MediaLibraryDraggable kind="media" id={item.id}>
                  {tile}
                </MediaLibraryDraggable>
              ) : (
                tile
              )}
            </div>
          )
        }

        return (
          <ContextMenu key={item.id}>
            {fileTrigger}
            <ContextMenuContent>
              <FileContextMenuItems
                item={item}
                onMoveItem={onMoveItem}
                onCopyItem={onCopyItem}
                onDeleteItem={onDeleteItem}
                onPreviewItem={onPreviewItem}
                onViewProperties={onViewProperties}
                onRemoveBackground={onRemoveBackground}
                processingItemId={processingItemId}
              />
            </ContextMenuContent>
          </ContextMenu>
        )
      })}
    </div>
  )
}
