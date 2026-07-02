"use client"

import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { useDeleteManyMedia } from "@/hooks/tenant/use-media-query"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Spinner } from "@/components/ui/spinner"

interface MediaBulkDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids: number[]
  onSuccess?: () => void
}

export function MediaBulkDeleteDialog({
  open,
  onOpenChange,
  ids,
  onSuccess,
}: MediaBulkDeleteDialogProps) {
  const deleteMany = useDeleteManyMedia()

  const handleDelete = () => {
    deleteMany.mutate(ids, {
      onSuccess: () => {
        toast.success(
          `Deleted ${ids.length} file${ids.length === 1 ? "" : "s"}`
        )
        onSuccess?.()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete files")
      },
    })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            Delete selected files?
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{ids.length}</span>{" "}
            selected file{ids.length === 1 ? "" : "s"}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMany.isPending}
          >
            {deleteMany.isPending && <Spinner />}
            Delete {ids.length}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
