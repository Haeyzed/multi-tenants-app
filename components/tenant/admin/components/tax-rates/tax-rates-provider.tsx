"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type TaxRate } from "@/types/tenant/tax-rate"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type TaxRatesDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"

type TaxRatesContextType = {
  open: TaxRatesDialogType | null
  setOpen: (str: TaxRatesDialogType | null) => void
  currentRow: TaxRate | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TaxRate | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<
    React.SetStateAction<ExportSelection | null>
  >
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const TaxRatesContext = React.createContext<TaxRatesContextType | null>(null)

export function TaxRatesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TaxRatesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TaxRate | null>(null)
  const [exportSelection, setExportSelection] =
    useState<ExportSelection | null>(null)
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <TaxRatesContext
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
    </TaxRatesContext>
  )
}

export const useTaxRates = () => {
  const context = React.useContext(TaxRatesContext)

  if (!context) {
    throw new Error("useTaxRates has to be used within <TaxRatesProvider>")
  }

  return context
}
