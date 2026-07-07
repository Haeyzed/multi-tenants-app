"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Plan } from "@/types/central/plan"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/central/export"

type PlansDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"

type PlansContextType = {
  open: PlansDialogType | null
  setOpen: (str: PlansDialogType | null) => void
  currentRow: Plan | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Plan | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<
    React.SetStateAction<ExportSelection | null>
  >
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const PlansContext = React.createContext<PlansContextType | null>(null)

export function PlansProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<PlansDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Plan | null>(null)
  const [exportSelection, setExportSelection] =
    useState<ExportSelection | null>(null)
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <PlansContext
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
    </PlansContext>
  )
}

export const usePlans = () => {
  const plansContext = React.useContext(PlansContext)

  if (!plansContext) {
    throw new Error("usePlans has to be used within <PlansProvider>")
  }

  return plansContext
}
