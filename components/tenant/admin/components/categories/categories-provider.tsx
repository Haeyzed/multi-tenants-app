"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Category } from "@/types/tenant/category"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type CategoriesDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"

type CategoriesContextType = {
  open: CategoriesDialogType | null
  setOpen: (str: CategoriesDialogType | null) => void
  currentRow: Category | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Category | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<
    React.SetStateAction<ExportSelection | null>
  >
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const CategoriesContext = React.createContext<CategoriesContextType | null>(
  null
)

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<CategoriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Category | null>(null)
  const [exportSelection, setExportSelection] =
    useState<ExportSelection | null>(null)
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <CategoriesContext
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
    </CategoriesContext>
  )
}

export const useCategories = () => {
  const categoriesContext = React.useContext(CategoriesContext)

  if (!categoriesContext) {
    throw new Error("useCategories has to be used within <CategoriesProvider>")
  }

  return categoriesContext
}
