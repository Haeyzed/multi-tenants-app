"use client"

import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import * as React from "react"
import {
  useCreateMediaFolder,
  useUpdateMediaFolder,
} from "@/hooks/tenant/use-media-query"
import type { MediaBrowserFolder, MediaFolder } from "@/types/tenant/media"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"

interface MediaFolderFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentId?: number | null
  folder?: MediaFolder | MediaBrowserFolder | null
  onCreated?: (folder: MediaFolder) => void
  onUpdated?: (folder: MediaFolder) => void
}

export function MediaFolderFormDialog({
  open,
  onOpenChange,
  parentId = null,
  folder = null,
  onCreated,
  onUpdated,
}: MediaFolderFormDialogProps) {
  const isEdit = !!folder
  const [name, setName] = React.useState("")
  const createFolder = useCreateMediaFolder()
  const updateFolder = useUpdateMediaFolder()
  const isPending = createFolder.isPending || updateFolder.isPending

  React.useEffect(() => {
    if (open) {
      setName(folder?.name ?? "")
    }
  }, [open, folder])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (isEdit && folder) {
      updateFolder.mutate(
        {
          id: folder.id,
          payload: { name: name.trim() },
        },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Folder renamed successfully")
            onUpdated?.(result.data)
            onOpenChange(false)
          },
          onError: (error) => toastApiError(error, "Unable to rename folder"),
        }
      )
      return
    }

    createFolder.mutate(
      {
        name: name.trim(),
        parent_id: parentId,
      },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Folder created successfully")
          onCreated?.(result.data)
          onOpenChange(false)
        },
        onError: (error) => toastApiError(error, "Unable to create folder"),
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEdit ? "Rename folder" : "Create folder"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEdit
              ? "Update the folder name."
              : "Organize your media library with folders."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="media-folder-form"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="media-folder-name">Folder name</FieldLabel>
              <Input
                id="media-folder-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Product photos"
                required
              />
            </Field>
          </FieldGroup>
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
          <Button
            type="submit"
            form="media-folder-form"
            disabled={isPending || !name.trim()}
          >
            {isPending ? (
              <>
                <Spinner />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Save"
            ) : (
              "Create folder"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
