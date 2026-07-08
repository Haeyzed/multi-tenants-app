"use client"

import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDeleteManyCollections } from "@/hooks/tenant/use-collection-query"

type CollectionsMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids: number[]
  onComplete?: () => void
}

const CONFIRM_WORD = "DELETE"

export function CollectionsMultiDeleteDialog({
  open,
  onOpenChange,
  ids,
  onComplete,
}: CollectionsMultiDeleteDialogProps) {
  const [value, setValue] = useState("")
  const deleteMany = useDeleteManyCollections()

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toastApiError(
        new Error(`Please type "${CONFIRM_WORD}" to confirm.`),
        `Please type "${CONFIRM_WORD}" to confirm.`
      )
      return
    }

    deleteMany.mutate(ids, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Deleted ${ids.length} ${ids.length > 1 ? "collections" : "collection"}`
        )
        setValue("")
        onComplete?.()
        onOpenChange(false)
      },
      onError: (error) => toastApiError(error, "Failed to delete collections"),
    })
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(val) => {
        if (!val) setValue("")
        onOpenChange(val)
      }}
    >
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            Delete {ids.length} {ids.length > 1 ? "collections" : "collection"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Are you sure you want to delete the selected collections? This
            action cannot be undone.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="space-y-4 py-2">
          <Label className="flex flex-col items-start gap-1.5">
            <span>Confirm by typing "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
              autoFocus
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={value.trim() !== CONFIRM_WORD || deleteMany.isPending}
          >
            {deleteMany.isPending && <Spinner />}
            Delete
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
