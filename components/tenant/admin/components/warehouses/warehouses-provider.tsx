"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Warehouse } from "@/types/tenant/warehouse"
import { type BulkDeleteSelection, type ExportSelection } from "@/types/tenant/export"

type WarehousesDialogType =
  | "create"
  | "update"
  | "view"
  | "viewMap"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"
  | "manageZones"
  | "manageLocations"

type WarehousesContextType = {
  open: WarehousesDialogType | null
  setOpen: (str: WarehousesDialogType | null) => void
  currentRow: Warehouse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Warehouse | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<React.SetStateAction<ExportSelection | null>>
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const WarehousesContext = React.createContext<WarehousesContextType | null>(null)

export function WarehousesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<WarehousesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Warehouse | null>(null)
  const [exportSelection, setExportSelection] = useState<ExportSelection | null>(
    null
  )
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <WarehousesContext
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
    </WarehousesContext>
  )
}

export const useWarehouses = () => {
  const context = React.useContext(WarehousesContext)

  if (!context) {
    throw new Error("useWarehouses has to be used within <WarehousesProvider>")
  }

  return context
}
