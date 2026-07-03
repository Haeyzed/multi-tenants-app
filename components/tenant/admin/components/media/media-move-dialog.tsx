"use client"

import { FolderPlusIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { MediaFolderFormDialog } from "@/components/tenant/admin/components/media/media-folder-form-dialog"
import { MediaFolderTree } from "@/components/tenant/admin/components/media/media-folder-tree"
import {
  useCopyMedia,
  useCopyMediaFolder,
  useGetMediaFolderTree,
  useMoveMedia,
  useMoveMediaFolder,
} from "@/hooks/tenant/use-media-query"
import type { MediaBrowserFolder } from "@/types/tenant/media"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"

interface MediaMoveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mediaIds?: number[]
  folders?: MediaBrowserFolder[]
  mode: "move" | "copy"
  onSuccess?: () => void
}

export function MediaMoveDialog({
  open,
  onOpenChange,
  mediaIds = [],
  folders = [],
  mode,
  onSuccess,
}: MediaMoveDialogProps) {
  const [targetFolderId, setTargetFolderId] = React.useState<number | null>(null)
  const [folderDialogOpen, setFolderDialogOpen] = React.useState(false)
  const moveMedia = useMoveMedia()
  const copyMedia = useCopyMedia()
  const moveMediaFolder = useMoveMediaFolder()
  const copyMediaFolder = useCopyMediaFolder()
  const treeQuery = useGetMediaFolderTree(open)

  const totalItems = mediaIds.length + folders.length
  const isPending =
    moveMedia.isPending ||
    copyMedia.isPending ||
    moveMediaFolder.isPending ||
    copyMediaFolder.isPending

  React.useEffect(() => {
    if (open) {
      setTargetFolderId(null)
    }
  }, [open])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    try {
      if (mode === "move") {
        if (mediaIds.length > 0) {
          await moveMedia.mutateAsync({ ids: mediaIds, folderId: targetFolderId })
        }

        for (const folder of folders) {
          await moveMediaFolder.mutateAsync({
            id: folder.id,
            parentId: targetFolderId,
          })
        }
      } else {
        if (mediaIds.length > 0) {
          await copyMedia.mutateAsync({ ids: mediaIds, folderId: targetFolderId })
        }

        for (const folder of folders) {
          await copyMediaFolder.mutateAsync({
            id: folder.id,
            name: folder.name,
            parentId: targetFolderId,
          })
        }
      }

      toast.success(
        mode === "move"
          ? "Moved successfully"
          : "Copied successfully"
      )
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to complete this action"
      )
    }
  }

  const title =
    mode === "move"
      ? folders.length > 0 && mediaIds.length === 0
        ? "Move folders"
        : folders.length > 0
          ? "Move items"
          : "Move files"
      : folders.length > 0 && mediaIds.length === 0
        ? "Copy folders"
        : folders.length > 0
          ? "Copy items"
          : "Copy files"

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Choose a destination folder for {totalItems} selected item
            {totalItems === 1 ? "" : "s"}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form id="media-move-form" className="space-y-4" onSubmit={handleSubmit}>
          {treeQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading folders...</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">Destination</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFolderDialogOpen(true)}
                >
                  <FolderPlusIcon className="size-4" />
                  New folder
                </Button>
              </div>
              <MediaFolderTree
                tree={treeQuery.data?.tree ?? []}
                selectedFolderId={targetFolderId}
                onSelectFolder={setTargetFolderId}
                enableDropTargets
              />
            </div>
          )}
        </form>

        <MediaFolderFormDialog
          open={folderDialogOpen}
          onOpenChange={setFolderDialogOpen}
          parentId={targetFolderId}
          onCreated={(folder) => setTargetFolderId(folder.id)}
        />

        <ResponsiveDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="media-move-form" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner />
                Working...
              </>
            ) : mode === "move" ? (
              "Move"
            ) : (
              "Copy"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
