"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Brand } from "@/types/tenant/brand"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type BrandsDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"

type BrandsContextType = {
  open: BrandsDialogType | null
  setOpen: (str: BrandsDialogType | null) => void
  currentRow: Brand | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Brand | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<React.SetStateAction<ExportSelection | null>>
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const BrandsContext = React.createContext<BrandsContextType | null>(null)

export function BrandsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BrandsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Brand | null>(null)
  const [exportSelection, setExportSelection] = useState<ExportSelection | null>(
    null
  )
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <BrandsContext
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
    </BrandsContext>
  )
}

export const useBrands = () => {
  const brandsContext = React.useContext(BrandsContext)

  if (!brandsContext) {
    throw new Error("useBrands has to be used within <BrandsProvider>")
  }

  return brandsContext
}
