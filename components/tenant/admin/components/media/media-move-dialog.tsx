"use client"

import { FolderPlusIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { MediaFolderFormDialog } from "@/components/tenant/admin/components/media/media-folder-form-dialog"
import { MediaFolderTree } from "@/components/tenant/admin/components/media/media-folder-tree"
import {
  useCopyMedia,
  useGetMediaFolderTree,
  useMoveMedia,
} from "@/hooks/tenant/use-media-query"
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
  ids: number[]
  mode: "move" | "copy"
  onSuccess?: () => void
}

export function MediaMoveDialog({
  open,
  onOpenChange,
  ids,
  mode,
  onSuccess,
}: MediaMoveDialogProps) {
  const [targetFolderId, setTargetFolderId] = React.useState<number | null>(null)
  const [folderDialogOpen, setFolderDialogOpen] = React.useState(false)
  const moveMedia = useMoveMedia()
  const copyMedia = useCopyMedia()
  const treeQuery = useGetMediaFolderTree(open)
  const mutation = mode === "move" ? moveMedia : copyMedia

  React.useEffect(() => {
    if (open) {
      setTargetFolderId(null)
    }
  }, [open])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    mutation.mutate(
      { ids, folderId: targetFolderId },
      {
        onSuccess: () => {
          toast.success(
            mode === "move"
              ? "Files moved successfully"
              : "Files copied successfully"
          )
          onSuccess?.()
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || "Unable to complete this action")
        },
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {mode === "move" ? "Move files" : "Copy files"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Choose a destination folder for {ids.length} selected file
            {ids.length === 1 ? "" : "s"}.
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
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="media-move-form" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Spinner />
                Working...
              </>
            ) : mode === "move" ? (
              "Move files"
            ) : (
              "Copy files"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
