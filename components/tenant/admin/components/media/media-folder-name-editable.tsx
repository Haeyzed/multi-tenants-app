"use client"

import * as React from "react"

import {
  Editable,
  EditableArea,
  EditableInput,
  EditablePreview,
} from "@/components/ui/editable"
import { useUpdateMediaFolder } from "@/hooks/tenant/use-media-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import { cn } from "@/lib/utils"

interface MediaFolderNameEditableProps {
  folderId: number
  name: string
  editing?: boolean
  onEditingChange?: (editing: boolean) => void
  className?: string
  previewClassName?: string
  inputClassName?: string
}

export function MediaFolderNameEditable({
  folderId,
  name,
  editing,
  onEditingChange,
  className,
  previewClassName,
  inputClassName,
}: MediaFolderNameEditableProps) {
  const updateFolder = useUpdateMediaFolder()

  const handleSubmit = React.useCallback(
    (value: string) => {
      const trimmed = value.trim()
      if (!trimmed) {
        onEditingChange?.(false)
        return
      }

      if (trimmed === name) {
        return
      }

      updateFolder.mutate(
        { id: folderId, payload: { name: trimmed } },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Folder renamed successfully")
          },
          onError: (error) => toastApiError(error, "Unable to rename folder"),
        }
      )
    },
    [folderId, name, onEditingChange, updateFolder]
  )

  return (
    <Editable
      value={name}
      editing={editing}
      onEditingChange={onEditingChange}
      onSubmit={handleSubmit}
      triggerMode="dblclick"
      className={cn("min-w-0 gap-0", className)}
    >
      <EditableArea className="w-full min-w-0">
        <EditablePreview
          className={cn(
            "truncate border-0 px-0 py-0 text-start",
            previewClassName
          )}
          onDoubleClick={(event) => event.stopPropagation()}
        />
        <EditableInput
          className={cn("h-7 min-w-0 px-1 text-sm", inputClassName)}
          onClick={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
        />
      </EditableArea>
    </Editable>
  )
}
