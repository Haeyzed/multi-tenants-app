"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Tag } from "@/types/tenant/tag"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type TagsDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"

type TagsContextType = {
  open: TagsDialogType | null
  setOpen: (str: TagsDialogType | null) => void
  currentRow: Tag | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Tag | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<
    React.SetStateAction<ExportSelection | null>
  >
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const TagsContext = React.createContext<TagsContextType | null>(null)

export function TagsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TagsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Tag | null>(null)
  const [exportSelection, setExportSelection] =
    useState<ExportSelection | null>(null)
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <TagsContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        exportSelection,
        setExportSelection,
        deleteManySelection,
        setDeleteManySelection,
      }}
    >
      {children}
    </TagsContext>
  )
}

export const useTags = () => {
  const tagsContext = React.useContext(TagsContext)

  if (!tagsContext) {
    throw new Error("useTags has to be used within <TagsProvider>")
  }

  return tagsContext
}
