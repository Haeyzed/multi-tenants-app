"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type TaxRule } from "@/types/tenant/tax-rule"
import { type BulkDeleteSelection, type ExportSelection } from "@/types/tenant/export"

type TaxRulesDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "export"
  | "deleteMany"

type TaxRulesContextType = {
  open: TaxRulesDialogType | null
  setOpen: (str: TaxRulesDialogType | null) => void
  currentRow: TaxRule | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TaxRule | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<React.SetStateAction<ExportSelection | null>>
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const TaxRulesContext = React.createContext<TaxRulesContextType | null>(null)

export function TaxRulesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TaxRulesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TaxRule | null>(null)
  const [exportSelection, setExportSelection] = useState<ExportSelection | null>(
    null
  )
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <TaxRulesContext
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
    </TaxRulesContext>
  )
}

export const useTaxRules = () => {
  const context = React.useContext(TaxRulesContext)

  if (!context) {
    throw new Error("useTaxRules has to be used within <TaxRulesProvider>")
  }

  return context
}
