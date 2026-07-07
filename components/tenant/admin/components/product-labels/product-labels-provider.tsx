"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type ProductLabel } from "@/types/tenant/product-label"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type ProductLabelsDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"

type ProductLabelsContextType = {
  open: ProductLabelsDialogType | null
  setOpen: (str: ProductLabelsDialogType | null) => void
  currentRow: ProductLabel | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ProductLabel | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<React.SetStateAction<ExportSelection | null>>
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const ProductLabelsContext = React.createContext<ProductLabelsContextType | null>(
  null
)

export function ProductLabelsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<ProductLabelsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ProductLabel | null>(null)
  const [exportSelection, setExportSelection] = useState<ExportSelection | null>(
    null
  )
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <ProductLabelsContext
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
    </ProductLabelsContext>
  )
}

export const useProductLabels = () => {
  const productLabelsContext = React.useContext(ProductLabelsContext)

  if (!productLabelsContext) {
    throw new Error("useProductLabels has to be used within <ProductLabelsProvider>")
  }

  return productLabelsContext
}
