"use client"

import { ImageMinusIcon, SparklesIcon } from "lucide-react"

import { isMediaImage } from "@/lib/tenant/media-file-kind"
import type { MediaItem } from "@/types/tenant/media"
import {
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"

type MediaAiFeaturesMenuProps = {
  item: MediaItem
  onRemoveBackground?: (item: MediaItem) => void
  processingItemId?: number | null
}

function RemoveBackgroundLabel({ isProcessing }: { isProcessing: boolean }) {
  return (
    <>
      {isProcessing ? <Spinner className="size-4" /> : <ImageMinusIcon />}
      Remove background
    </>
  )
}

export function MediaAiContextMenuSub({
  item,
  onRemoveBackground,
  processingItemId = null,
}: MediaAiFeaturesMenuProps) {
  if (!isMediaImage(item) || !onRemoveBackground) {
    return null
  }

  const isProcessing = processingItemId === item.id

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>
        <SparklesIcon />
        AI Features
      </ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem
          disabled={isProcessing}
          onClick={() => onRemoveBackground(item)}
        >
          <RemoveBackgroundLabel isProcessing={isProcessing} />
        </ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  )
}

export function MediaAiDropdownMenuSub({
  item,
  onRemoveBackground,
  processingItemId = null,
}: MediaAiFeaturesMenuProps) {
  if (!isMediaImage(item) || !onRemoveBackground) {
    return null
  }

  const isProcessing = processingItemId === item.id

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SparklesIcon />
        AI Features
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem
          disabled={isProcessing}
          onClick={() => onRemoveBackground(item)}
        >
          <RemoveBackgroundLabel isProcessing={isProcessing} />
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
