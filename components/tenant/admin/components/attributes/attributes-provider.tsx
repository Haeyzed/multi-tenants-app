"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Attribute } from "@/types/tenant/attribute"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type AttributesDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"
  | "manageValues"

type AttributesContextType = {
  open: AttributesDialogType | null
  setOpen: (str: AttributesDialogType | null) => void
  currentRow: Attribute | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Attribute | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<React.SetStateAction<ExportSelection | null>>
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const AttributesContext = React.createContext<AttributesContextType | null>(null)

export function AttributesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<AttributesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Attribute | null>(null)
  const [exportSelection, setExportSelection] = useState<ExportSelection | null>(
    null
  )
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <AttributesContext
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
    </AttributesContext>
  )
}

export const useAttributes = () => {
  const attributesContext = React.useContext(AttributesContext)

  if (!attributesContext) {
    throw new Error("useAttributes has to be used within <AttributesProvider>")
  }

  return attributesContext
}
