"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type TaxZone } from "@/types/tenant/tax-zone"
import { type BulkDeleteSelection, type ExportSelection } from "@/types/tenant/export"

type TaxZonesDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"

type TaxZonesContextType = {
  open: TaxZonesDialogType | null
  setOpen: (str: TaxZonesDialogType | null) => void
  currentRow: TaxZone | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TaxZone | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<React.SetStateAction<ExportSelection | null>>
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const TaxZonesContext = React.createContext<TaxZonesContextType | null>(null)

export function TaxZonesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TaxZonesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TaxZone | null>(null)
  const [exportSelection, setExportSelection] = useState<ExportSelection | null>(
    null
  )
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <TaxZonesContext
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
    </TaxZonesContext>
  )
}

export const useTaxZones = () => {
  const context = React.useContext(TaxZonesContext)

  if (!context) {
    throw new Error("useTaxZones has to be used within <TaxZonesProvider>")
  }

  return context
}
