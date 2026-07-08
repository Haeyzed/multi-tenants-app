"use client"

import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import { FolderPlusIcon } from "lucide-react"
import * as React from "react"
import { MediaFolderTree } from "@/components/tenant/admin/components/media/media-folder-tree"
import {
  useCopyMedia,
  useCopyMediaFolder,
  useCreateMediaFolder,
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
  const [targetFolderId, setTargetFolderId] = React.useState<number | null>(
    null
  )
  const [editingFolderId, setEditingFolderId] = React.useState<number | null>(
    null
  )
  const moveMedia = useMoveMedia()
  const copyMedia = useCopyMedia()
  const moveMediaFolder = useMoveMediaFolder()
  const copyMediaFolder = useCopyMediaFolder()
  const createFolderMutation = useCreateMediaFolder()
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
      setEditingFolderId(null)
    }
  }, [open])

  const handleCreateFolder = React.useCallback(() => {
    createFolderMutation.mutate(
      {
        name: "New folder",
        parent_id: targetFolderId,
      },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Folder created successfully")
          setTargetFolderId(result.data.id)
          setEditingFolderId(result.data.id)
        },
        onError: (error) => toastApiError(error, "Unable to create folder"),
      }
    )
  }, [createFolderMutation, targetFolderId])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    try {
      if (mode === "move") {
        if (mediaIds.length > 0) {
          await moveMedia.mutateAsync({
            ids: mediaIds,
            folderId: targetFolderId,
          })
        }

        for (const folder of folders) {
          await moveMediaFolder.mutateAsync({
            id: folder.id,
            parentId: targetFolderId,
          })
        }
      } else {
        if (mediaIds.length > 0) {
          await copyMedia.mutateAsync({
            ids: mediaIds,
            folderId: targetFolderId,
          })
        }

        for (const folder of folders) {
          await copyMediaFolder.mutateAsync({
            id: folder.id,
            name: folder.name,
            parentId: targetFolderId,
          })
        }
      }

      toastApiSuccess(
        null,
        mode === "move" ? "Moved successfully" : "Copied successfully"
      )
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toastApiError(error, "Unable to complete this action")
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

        <form
          id="media-move-form"
          className="space-y-4"
          onSubmit={handleSubmit}
        >
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
                  onClick={handleCreateFolder}
                  disabled={createFolderMutation.isPending}
                >
                  <FolderPlusIcon className="size-4" />
                  New folder
                </Button>
              </div>
              <MediaFolderTree
                tree={treeQuery.data?.tree ?? []}
                selectedFolderId={targetFolderId}
                editingFolderId={editingFolderId}
                onEditingFolderIdChange={setEditingFolderId}
                onSelectFolder={setTargetFolderId}
                enableDropTargets
              />
            </div>
          )}
        </form>

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
