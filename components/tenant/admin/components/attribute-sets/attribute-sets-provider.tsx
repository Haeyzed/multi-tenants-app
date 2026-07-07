"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type AttributeSet } from "@/types/tenant/attribute-set"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type AttributeSetsDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"
  | "manageAttributes"

type AttributeSetsContextType = {
  open: AttributeSetsDialogType | null
  setOpen: (str: AttributeSetsDialogType | null) => void
  currentRow: AttributeSet | null
  setCurrentRow: React.Dispatch<React.SetStateAction<AttributeSet | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<
    React.SetStateAction<ExportSelection | null>
  >
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const AttributeSetsContext =
  React.createContext<AttributeSetsContextType | null>(null)

export function AttributeSetsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<AttributeSetsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AttributeSet | null>(null)
  const [exportSelection, setExportSelection] =
    useState<ExportSelection | null>(null)
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <AttributeSetsContext
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
    </AttributeSetsContext>
  )
}

export const useAttributeSets = () => {
  const context = React.useContext(AttributeSetsContext)

  if (!context) {
    throw new Error(
      "useAttributeSets has to be used within <AttributeSetsProvider>"
    )
  }

  return context
}
