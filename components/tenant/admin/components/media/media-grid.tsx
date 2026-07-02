"use client"

import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FolderInputIcon,
  FolderIcon,
  ImageIcon,
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
} from "@/lib/tenant/media-file-kind"
import type { MediaBrowserFolder, MediaItem } from "@/types/tenant/media"
import {
  MediaAiContextMenuSub,
  MediaAiDropdownMenuSub,
} from "@/components/tenant/admin/components/media/media-ai-features-menu"
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
  selectedIds: number[]
  pickerValue?: number | null
  onOpenFolder?: (folderId: number) => void
  onToggleSelect?: (id: number) => void
  onPick?: (item: MediaItem) => void
  onMoveItem?: (id: number) => void
  onCopyItem?: (id: number) => void
  onDeleteItem?: (id: number) => void
  onPreviewItem?: (item: MediaItem) => void
  onRemoveBackground?: (item: MediaItem) => void
  processingItemId?: number | null
  onRenameFolder?: (folder: MediaBrowserFolder) => void
  onDeleteFolder?: (folder: MediaBrowserFolder) => void
}

function MediaFileActions({
  item,
  onMoveItem,
  onCopyItem,
  onDeleteItem,
  onPreviewItem,
  onRemoveBackground,
  processingItemId,
}: {
  item: MediaItem
  onMoveItem?: (id: number) => void
  onCopyItem?: (id: number) => void
  onDeleteItem?: (id: number) => void
  onPreviewItem?: (item: MediaItem) => void
  onRemoveBackground?: (item: MediaItem) => void
  processingItemId?: number | null
}) {
  if (
    !onMoveItem &&
    !onCopyItem &&
    !onDeleteItem &&
    !onPreviewItem &&
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
            className="absolute end-1 top-1 size-7 bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
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
        {onMoveItem ? (
          <DropdownMenuItem onClick={() => onMoveItem(item.id)}>
            <FolderInputIcon />
            Move
          </DropdownMenuItem>
        ) : null}
        {onCopyItem ? (
          <DropdownMenuItem onClick={() => onCopyItem(item.id)}>
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
  onRemoveBackground,
  processingItemId,
}: {
  item: MediaItem
  onMoveItem?: (id: number) => void
  onCopyItem?: (id: number) => void
  onDeleteItem?: (id: number) => void
  onPreviewItem?: (item: MediaItem) => void
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
      {onMoveItem ? (
        <ContextMenuItem onClick={() => onMoveItem(item.id)}>
          <FolderInputIcon />
          Move
        </ContextMenuItem>
      ) : null}
      {onCopyItem ? (
        <ContextMenuItem onClick={() => onCopyItem(item.id)}>
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
}: {
  folder: MediaBrowserFolder
  onRenameFolder?: (folder: MediaBrowserFolder) => void
  onDeleteFolder?: (folder: MediaBrowserFolder) => void
}) {
  if (!onRenameFolder && !onDeleteFolder) return null

  return (
    <>
      {onRenameFolder ? (
        <ContextMenuItem onClick={() => onRenameFolder(folder)}>
          <PencilIcon />
          Rename
        </ContextMenuItem>
      ) : null}
      {onDeleteFolder ? (
        <>
          {onRenameFolder ? <ContextMenuSeparator /> : null}
          <ContextMenuItem
            variant="destructive"
            onClick={() => onDeleteFolder(folder)}
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
  selectedIds,
  pickerValue,
  onOpenFolder,
  onToggleSelect,
  onPick,
  onMoveItem,
  onCopyItem,
  onDeleteItem,
  onPreviewItem,
  onRemoveBackground,
  processingItemId,
  onRenameFolder,
  onDeleteFolder,
}: MediaGridProps) {
  const isEmpty = folders.length === 0 && items.length === 0

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
        const folderTile = (
          <button
            type="button"
            data-media-folder
            className="group relative w-full overflow-hidden rounded-md border bg-card text-left transition-colors hover:border-primary/40"
            onClick={() => onOpenFolder?.(folder.id)}
          >
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

        if (mode !== "manage" || (!onRenameFolder && !onDeleteFolder)) {
          return <div key={`folder-${folder.id}`}>{folderTile}</div>
        }

        return (
          <ContextMenu key={`folder-${folder.id}`}>
            <ContextMenuTrigger render={folderTile} />
            <ContextMenuContent>
              <FolderContextMenuItems
                folder={folder}
                onRenameFolder={onRenameFolder}
                onDeleteFolder={onDeleteFolder}
              />
            </ContextMenuContent>
          </ContextMenu>
        )
      })}

      {items.map((item) => {
        const isImage = isMediaImage(item)
        const extension = getMediaFileExtension(item)
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
              isSelected && "border-primary ring-2 ring-primary/20"
            )}
            onClick={() => {
              if (mode === "picker") {
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
                  <div className="absolute start-1 top-1">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect?.(item.id)}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Select ${item.title ?? item.name}`}
                      className="size-4"
                    />
                  </div>
                  <MediaFileActions
                    item={item}
                    onMoveItem={onMoveItem}
                    onCopyItem={onCopyItem}
                    onDeleteItem={onDeleteItem}
                    onPreviewItem={onPreviewItem}
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

        if (mode !== "manage") {
          return <div key={item.id}>{tile}</div>
        }

        return (
          <ContextMenu key={item.id}>
            <ContextMenuTrigger render={tile} />
            <ContextMenuContent>
              <FileContextMenuItems
                item={item}
                onMoveItem={onMoveItem}
                onCopyItem={onCopyItem}
                onDeleteItem={onDeleteItem}
                onPreviewItem={onPreviewItem}
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
