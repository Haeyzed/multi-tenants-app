"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type TaxClass } from "@/types/tenant/tax-class"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type TaxClassesDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"

type TaxClassesContextType = {
  open: TaxClassesDialogType | null
  setOpen: (str: TaxClassesDialogType | null) => void
  currentRow: TaxClass | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TaxClass | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<
    React.SetStateAction<ExportSelection | null>
  >
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const TaxClassesContext = React.createContext<TaxClassesContextType | null>(
  null
)

export function TaxClassesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<TaxClassesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TaxClass | null>(null)
  const [exportSelection, setExportSelection] =
    useState<ExportSelection | null>(null)
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <TaxClassesContext
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
    </TaxClassesContext>
  )
}

export const useTaxClasses = () => {
  const context = React.useContext(TaxClassesContext)

  if (!context) {
    throw new Error("useTaxClasses has to be used within <TaxClassesProvider>")
  }

  return context
}
