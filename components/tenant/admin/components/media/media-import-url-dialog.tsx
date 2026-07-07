"use client"

import * as React from "react"
import { toast } from "sonner"

import { useImportMediaFromUrl } from "@/hooks/tenant/use-media-query"
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

interface MediaImportUrlDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folderId?: number | null
}

export function MediaImportUrlDialog({
  open,
  onOpenChange,
  folderId = null,
}: MediaImportUrlDialogProps) {
  const [url, setUrl] = React.useState("")
  const [title, setTitle] = React.useState("")
  const importMutation = useImportMediaFromUrl()

  React.useEffect(() => {
    if (open) {
      setUrl("")
      setTitle("")
    }
  }, [open])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    importMutation.mutate(
      {
        url: url.trim(),
        folder_id: folderId,
        title: title.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("File imported successfully")
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || "Failed to import file from URL")
        },
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Import from URL</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Paste a direct link to an image or file. The server will download
            and add it to your library.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="media-import-url-form"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="media-import-url">File URL</FieldLabel>
              <Input
                id="media-import-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="media-import-title">
                Title (optional)
              </FieldLabel>
              <Input
                id="media-import-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Display name"
              />
            </Field>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={importMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="media-import-url-form"
            disabled={importMutation.isPending || !url.trim()}
          >
            {importMutation.isPending ? (
              <>
                <Spinner />
                Importing...
              </>
            ) : (
              "Import"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
