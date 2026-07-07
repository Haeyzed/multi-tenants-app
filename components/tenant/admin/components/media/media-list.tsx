"use client"

import { formatDistanceToNow } from "date-fns"
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FolderInputIcon,
  FolderIcon,
  GripVerticalIcon,
  InfoIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { downloadMediaItem } from "@/lib/tenant/media-download"
import { isMediaImage, isMediaPreviewable, mediaMatchesAccept } from "@/lib/tenant/media-file-kind"
import type { MediaBrowserFolder, MediaItem } from "@/types/tenant/media"
import {
  MediaAiContextMenuSub,
  MediaAiDropdownMenuSub,
} from "@/components/tenant/admin/components/media/media-ai-features-menu"
import {
  MediaLibraryDraggable,
  MediaLibraryDragHandle,
  MediaLibraryFolderDropTarget,
} from "@/components/tenant/admin/components/media/media-library-dnd"
import { MediaFileIcon } from "@/components/tenant/admin/components/shared/media-file-icon"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { Button } from "@/components/ui/button"
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

const listRowClassName =
  "group flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted/50"

interface MediaListProps {
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
        <ContextMenuItem onClick={runMenuAction(() => onPreviewItem(item))}>
          <EyeIcon />
          Open
        </ContextMenuItem>
      ) : null}
      {onViewProperties ? (
        <ContextMenuItem onClick={runMenuAction(() => onViewProperties(item))}>
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
      <ContextMenuItem onClick={runMenuAction(() => downloadMediaItem(item))}>
        <DownloadIcon />
        Download
      </ContextMenuItem>
      {onDeleteItem ? (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onClick={runMenuAction(() => onDeleteItem(item.id))}
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

function MediaFileRowActions({
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 data-[state=open]:opacity-100"
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

function MediaFolderRowActions({
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 data-[state=open]:opacity-100"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-40">
        {onMoveFolder ? (
          <DropdownMenuItem onClick={runMenuAction(() => onMoveFolder(folder))}>
            <FolderInputIcon />
            Move
          </DropdownMenuItem>
        ) : null}
        {onCopyFolder ? (
          <DropdownMenuItem onClick={runMenuAction(() => onCopyFolder(folder))}>
            <CopyIcon />
            Copy
          </DropdownMenuItem>
        ) : null}
        {onRenameFolder ? (
          <DropdownMenuItem onClick={runMenuAction(() => onRenameFolder(folder))}>
            <PencilIcon />
            Rename
          </DropdownMenuItem>
        ) : null}
        {onDeleteFolder ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDeleteFolder(folder)}
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

export function MediaList({
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
}: MediaListProps) {
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
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {folders.map((folder) => {
        const folderRow = (
          <div
            data-media-folder
            className={cn(listRowClassName, "cursor-pointer")}
            onClick={() => onOpenFolder?.(folder.id)}
          >
            <div className="flex shrink-0 items-center gap-0.5">
              {enableDrag ? (
                <MediaLibraryDragHandle className="static opacity-100">
                  <GripVerticalIcon className="size-4" />
                </MediaLibraryDragHandle>
              ) : null}
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center">
              <FolderIcon className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{folder.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {folder.media_count ?? 0} files
              </p>
            </div>
            {mode === "manage" && hasFolderMenu ? (
              <MediaFolderRowActions
                folder={folder}
                onRenameFolder={onRenameFolder}
                onDeleteFolder={onDeleteFolder}
                onMoveFolder={onMoveFolder}
                onCopyFolder={onCopyFolder}
              />
            ) : null}
          </div>
        )

        const folderTrigger = enableDrag ? (
          <MediaLibraryDraggable kind="folder" id={folder.id}>
            <MediaLibraryFolderDropTarget folderId={folder.id}>
              <ContextMenuTrigger render={folderRow} />
            </MediaLibraryFolderDropTarget>
          </MediaLibraryDraggable>
        ) : (
          <ContextMenuTrigger render={folderRow} />
        )

        if (mode !== "manage" || !hasFolderMenu) {
          return (
            <div key={`folder-${folder.id}`}>
              {enableDrag ? (
                <MediaLibraryDraggable kind="folder" id={folder.id}>
                  <MediaLibraryFolderDropTarget folderId={folder.id}>
                    {folderRow}
                  </MediaLibraryFolderDropTarget>
                </MediaLibraryDraggable>
              ) : (
                folderRow
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
        const isPickable = mode !== "picker" || mediaMatchesAccept(item, accept)
        const isSelected =
          mode === "picker"
            ? pickerValue === item.id
            : selectedIds.includes(item.id)

        const fileRow = (
          <div
            data-media-item
            className={cn(
              listRowClassName,
              isPickable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
              isSelected && "border-primary bg-primary/5"
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
            <div className="flex shrink-0 items-center gap-0.5">
              {enableDrag ? (
                <MediaLibraryDragHandle className="static opacity-100">
                  <GripVerticalIcon className="size-4" />
                </MediaLibraryDragHandle>
              ) : null}
              {mode === "manage" ? (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleSelect?.(item.id)}
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`Select ${item.title ?? item.name}`}
                />
              ) : null}
            </div>

            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted/40">
              {isImage ? (
                <MediaThumbnail
                  media={item}
                  alt={item.alt_text ?? item.title ?? item.name}
                  size="sm"
                  zoomable={mode === "manage"}
                />
              ) : (
                <MediaFileIcon item={item} size="sm" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.title ?? item.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {formatFileSize(item.size)}
                {item.created_at
                  ? ` · ${formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}`
                  : ""}
              </p>
            </div>

            {mode === "manage" ? (
              <MediaFileRowActions
                item={item}
                onMoveItem={onMoveItem}
                onCopyItem={onCopyItem}
                onDeleteItem={onDeleteItem}
                onPreviewItem={onPreviewItem}
                onViewProperties={onViewProperties}
                onRemoveBackground={onRemoveBackground}
                processingItemId={processingItemId}
              />
            ) : null}

            {mode === "picker" && isSelected ? (
              <CheckIcon className="size-4 shrink-0 text-primary" />
            ) : null}
          </div>
        )

        const fileTrigger = enableDrag ? (
          <MediaLibraryDraggable kind="media" id={item.id}>
            <ContextMenuTrigger render={fileRow} />
          </MediaLibraryDraggable>
        ) : (
          <ContextMenuTrigger render={fileRow} />
        )

        if (mode !== "manage") {
          return (
            <div key={item.id}>
              {enableDrag ? (
                <MediaLibraryDraggable kind="media" id={item.id}>
                  {fileRow}
                </MediaLibraryDraggable>
              ) : (
                fileRow
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
