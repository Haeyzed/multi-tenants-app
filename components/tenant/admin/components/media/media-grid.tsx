"use client"

import { formatDistanceToNow } from "date-fns"
import {
  CheckIcon,
  CopyIcon,
  FileIcon,
  FolderIcon,
  ImageIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { MediaBrowserFolder, MediaItem } from "@/types/tenant/media"
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
}

function MediaFileActions({
  itemId,
  onMoveItem,
  onCopyItem,
  onDeleteItem,
}: {
  itemId: number
  onMoveItem?: (id: number) => void
  onCopyItem?: (id: number) => void
  onDeleteItem?: (id: number) => void
}) {
  if (!onMoveItem && !onCopyItem && !onDeleteItem) return null

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
        {onMoveItem ? (
          <DropdownMenuItem onClick={() => onMoveItem(itemId)}>
            Move
          </DropdownMenuItem>
        ) : null}
        {onCopyItem ? (
          <DropdownMenuItem onClick={() => onCopyItem(itemId)}>
            <CopyIcon />
            Copy
          </DropdownMenuItem>
        ) : null}
        {onDeleteItem ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDeleteItem(itemId)}
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
      {folders.map((folder) => (
        <button
          key={`folder-${folder.id}`}
          type="button"
          data-media-folder
          className="group relative overflow-hidden rounded-md border bg-card text-left transition-colors hover:border-primary/40"
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
      ))}

      {items.map((item) => {
        const isImage = item.mime_type?.startsWith("image/")
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
                  <FileIcon className="size-7 text-muted-foreground" />
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
                    itemId={item.id}
                    onMoveItem={onMoveItem}
                    onCopyItem={onCopyItem}
                    onDeleteItem={onDeleteItem}
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
                {isImage ? <ImageIcon className="size-3" /> : null}
                <span>{formatFileSize(item.size)}</span>
              </div>
            </div>
          </button>
        )

        if (mode !== "manage" || (!onMoveItem && !onCopyItem && !onDeleteItem)) {
          return <div key={item.id}>{tile}</div>
        }

        return (
          <ContextMenu key={item.id}>
            <ContextMenuTrigger render={tile} />
            <ContextMenuContent>
              {onMoveItem ? (
                <ContextMenuItem onClick={() => onMoveItem(item.id)}>
                  Move
                </ContextMenuItem>
              ) : null}
              {onCopyItem ? (
                <ContextMenuItem onClick={() => onCopyItem(item.id)}>
                  <CopyIcon />
                  Copy
                </ContextMenuItem>
              ) : null}
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
            </ContextMenuContent>
          </ContextMenu>
        )
      })}
    </div>
  )
}
