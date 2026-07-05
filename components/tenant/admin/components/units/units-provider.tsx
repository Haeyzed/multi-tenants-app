"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Unit } from "@/types/tenant/unit"
import { type BulkDeleteSelection, type ExportSelection } from "@/types/tenant/export"

type UnitsDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"

type UnitsContextType = {
  open: UnitsDialogType | null
  setOpen: (str: UnitsDialogType | null) => void
  currentRow: Unit | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Unit | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<React.SetStateAction<ExportSelection | null>>
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const UnitsContext = React.createContext<UnitsContextType | null>(null)

export function UnitsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UnitsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Unit | null>(null)
  const [exportSelection, setExportSelection] = useState<ExportSelection | null>(
    null
  )
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <UnitsContext
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
    </UnitsContext>
  )
}

export const useUnits = () => {
  const context = React.useContext(UnitsContext)

  if (!context) {
    throw new Error("useUnits has to be used within <UnitsProvider>")
  }

  return context
}
