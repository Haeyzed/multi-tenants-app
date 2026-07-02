"use client"

import { formatDistanceToNow } from "date-fns"
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FolderInputIcon,
  FolderIcon,
  InfoIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { downloadMediaItem } from "@/lib/tenant/media-download"
import { isMediaImage, isMediaPreviewable } from "@/lib/tenant/media-file-kind"
import type { MediaBrowserFolder, MediaItem } from "@/types/tenant/media"
import { MediaAiContextMenuSub } from "@/components/tenant/admin/components/media/media-ai-features-menu"
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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

interface MediaListProps {
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
  onViewProperties?: (item: MediaItem) => void
  onRemoveBackground?: (item: MediaItem) => void
  processingItemId?: number | null
  onRenameFolder?: (folder: MediaBrowserFolder) => void
  onDeleteFolder?: (folder: MediaBrowserFolder) => void
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

export function MediaList({
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
  onViewProperties,
  onRemoveBackground,
  processingItemId,
  onRenameFolder,
  onDeleteFolder,
}: MediaListProps) {
  const isEmpty = folders.length === 0 && items.length === 0

  if (isEmpty) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        <FolderIcon className="mb-3 size-8 text-muted-foreground/70" />
        <p className="font-medium text-foreground">This folder is empty</p>
      </div>
    )
  }

  return (
    <ItemGroup className="gap-1">
      {folders.map((folder) => {
        const row = (
          <Item
            size="sm"
            variant="outline"
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onOpenFolder?.(folder.id)}
          >
            <ItemMedia variant="icon">
              <FolderIcon className="text-amber-600 dark:text-amber-400" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{folder.name}</ItemTitle>
              <ItemDescription>{folder.media_count ?? 0} files</ItemDescription>
            </ItemContent>
          </Item>
        )

        if (mode !== "manage" || (!onRenameFolder && !onDeleteFolder)) {
          return <div key={`folder-${folder.id}`}>{row}</div>
        }

        return (
          <ContextMenu key={`folder-${folder.id}`}>
            <ContextMenuTrigger render={row} />
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
        const isSelected =
          mode === "picker"
            ? pickerValue === item.id
            : selectedIds.includes(item.id)

        const row = (
          <Item
            size="sm"
            variant="outline"
            className={cn(
              "cursor-pointer",
              isSelected && "border-primary bg-primary/5"
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
            {mode === "manage" ? (
              <ItemActions>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleSelect?.(item.id)}
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`Select ${item.title ?? item.name}`}
                />
              </ItemActions>
            ) : null}

            <ItemMedia variant={isImage ? "image" : "icon"}>
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
            </ItemMedia>

            <ItemContent>
              <ItemTitle>{item.title ?? item.name}</ItemTitle>
              <ItemDescription>
                {formatFileSize(item.size)}
                {item.created_at
                  ? ` · ${formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}`
                  : ""}
              </ItemDescription>
            </ItemContent>

            {mode === "picker" && isSelected ? (
              <ItemActions>
                <CheckIcon className="size-4 text-primary" />
              </ItemActions>
            ) : null}
          </Item>
        )

        if (mode !== "manage") {
          return <div key={item.id}>{row}</div>
        }

        return (
          <ContextMenu key={item.id}>
            <ContextMenuTrigger render={row} />
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
    </ItemGroup>
  )
}
