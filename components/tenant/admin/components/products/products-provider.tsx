"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Product } from "@/types/tenant/product"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type ProductsDialogType =
  | "delete"
  | "export"
  | "import"
  | "deleteMany"
  | "view"
  | "bulkStatus"
  | "bulkVisibility"
  | "manageFaqs"
  | "manageReviews"
  | "manageQuestions"

type BulkUpdateSelection = {
  ids: number[]
  onComplete?: () => void
}

type ProductsContextType = {
  open: ProductsDialogType | null
  setOpen: (str: ProductsDialogType | null) => void
  currentRow: Product | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Product | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<React.SetStateAction<ExportSelection | null>>
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
  bulkUpdateSelection: BulkUpdateSelection | null
  setBulkUpdateSelection: React.Dispatch<
    React.SetStateAction<BulkUpdateSelection | null>
  >
}

const ProductsContext = React.createContext<ProductsContextType | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProductsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Product | null>(null)
  const [exportSelection, setExportSelection] = useState<ExportSelection | null>(
    null
  )
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)
  const [bulkUpdateSelection, setBulkUpdateSelection] =
    useState<BulkUpdateSelection | null>(null)

  return (
    <ProductsContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        exportSelection,
        setExportSelection,
        deleteManySelection,
        setDeleteManySelection,
        bulkUpdateSelection,
        setBulkUpdateSelection,
      }}
    >
      {children}
    </ProductsContext>
  )
}

export const useProducts = () => {
  const productsContext = React.useContext(ProductsContext)

  if (!productsContext) {
    throw new Error("useProducts has to be used within <ProductsProvider>")
  }

  return productsContext
}
