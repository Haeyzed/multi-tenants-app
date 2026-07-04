"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Tenant } from "@/types/central/tenant"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/central/export"

type TenantsDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"
  | "add-domain"
  | "activate"
  | "suspend"

type TenantsContextType = {
  open: TenantsDialogType | null
  setOpen: (str: TenantsDialogType | null) => void
  currentRow: Tenant | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Tenant | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<React.SetStateAction<ExportSelection | null>>
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const TenantsContext = React.createContext<TenantsContextType | null>(null)

export function TenantsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TenantsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Tenant | null>(null)
  const [exportSelection, setExportSelection] = useState<ExportSelection | null>(
    null
  )
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <TenantsContext
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
    </TenantsContext>
  )
}

export const useTenants = () => {
  const tenantsContext = React.useContext(TenantsContext)

  if (!tenantsContext) {
    throw new Error("useTenants has to be used within <TenantsProvider>")
  }

  return tenantsContext
}
