"use client"

import { Spinner } from "@/components/ui/spinner"
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
import type { MediaBrowserFolder } from "@/types/tenant/media"

interface MediaFolderDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folder: MediaBrowserFolder | null
  onConfirm: () => void
  isDeleting?: boolean
}

export function MediaFolderDeleteDialog({
  open,
  onOpenChange,
  folder,
  onConfirm,
  isDeleting = false,
}: MediaFolderDeleteDialogProps) {
  if (!folder) return null

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Delete folder?</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            You are about to delete <strong>{folder.name}</strong>. This action
            cannot be undone.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Spinner />}
            Delete
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
