"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Collection } from "@/types/tenant/collection"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type CollectionsDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"

type CollectionsContextType = {
  open: CollectionsDialogType | null
  setOpen: (str: CollectionsDialogType | null) => void
  currentRow: Collection | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Collection | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<
    React.SetStateAction<ExportSelection | null>
  >
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const CollectionsContext = React.createContext<CollectionsContextType | null>(
  null
)

export function CollectionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<CollectionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Collection | null>(null)
  const [exportSelection, setExportSelection] =
    useState<ExportSelection | null>(null)
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <CollectionsContext
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
    </CollectionsContext>
  )
}

export const useCollections = () => {
  const collectionsContext = React.useContext(CollectionsContext)

  if (!collectionsContext) {
    throw new Error(
      "useCollections has to be used within <CollectionsProvider>"
    )
  }

  return collectionsContext
}
