"use client"

import { FolderPlusIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { useCreateMediaFolder } from "@/hooks/tenant/use-media-query"
import type { MediaFolder } from "@/types/tenant/media"
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
  onCreated?: (folder: MediaFolder) => void
}

export function MediaFolderFormDialog({
  open,
  onOpenChange,
  parentId = null,
  onCreated,
}: MediaFolderFormDialogProps) {
  const [name, setName] = React.useState("")
  const createFolder = useCreateMediaFolder()

  React.useEffect(() => {
    if (open) {
      setName("")
    }
  }, [open])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    createFolder.mutate(
      {
        name: name.trim(),
        parent_id: parentId,
      },
      {
        onSuccess: (folder) => {
          toast.success("Folder created successfully")
          onCreated?.(folder)
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || "Unable to create folder")
        },
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Create folder</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Organize your media library with folders.
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
            disabled={createFolder.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="media-folder-form"
            disabled={createFolder.isPending || !name.trim()}
          >
            {createFolder.isPending ? (
              <>
                <Spinner />
                Creating...
              </>
            ) : (
              "Create folder"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
