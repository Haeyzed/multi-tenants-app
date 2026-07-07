"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Supplier } from "@/types/tenant/supplier"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type SuppliersDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"
  | "manageContacts"
  | "manageAddresses"
  | "manageBankAccounts"

type SuppliersContextType = {
  open: SuppliersDialogType | null
  setOpen: (str: SuppliersDialogType | null) => void
  currentRow: Supplier | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Supplier | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<
    React.SetStateAction<ExportSelection | null>
  >
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const SuppliersContext = React.createContext<SuppliersContextType | null>(null)

export function SuppliersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SuppliersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Supplier | null>(null)
  const [exportSelection, setExportSelection] =
    useState<ExportSelection | null>(null)
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <SuppliersContext
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
    </SuppliersContext>
  )
}

export const useSuppliers = () => {
  const context = React.useContext(SuppliersContext)

  if (!context) {
    throw new Error("useSuppliers has to be used within <SuppliersProvider>")
  }

  return context
}
