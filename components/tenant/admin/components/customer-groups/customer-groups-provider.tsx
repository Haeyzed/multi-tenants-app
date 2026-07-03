"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type CustomerGroup } from "@/types/tenant/customer-group"
import {
  type BulkDeleteSelection,
  type ExportSelection,
} from "@/types/tenant/export"

type CustomerGroupsDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "import"
  | "export"
  | "deleteMany"

type CustomerGroupsContextType = {
  open: CustomerGroupsDialogType | null
  setOpen: (str: CustomerGroupsDialogType | null) => void
  currentRow: CustomerGroup | null
  setCurrentRow: React.Dispatch<React.SetStateAction<CustomerGroup | null>>
  exportSelection: ExportSelection | null
  setExportSelection: React.Dispatch<React.SetStateAction<ExportSelection | null>>
  deleteManySelection: BulkDeleteSelection | null
  setDeleteManySelection: React.Dispatch<
    React.SetStateAction<BulkDeleteSelection | null>
  >
}

const CustomerGroupsContext =
  React.createContext<CustomerGroupsContextType | null>(null)

export function CustomerGroupsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<CustomerGroupsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CustomerGroup | null>(null)
  const [exportSelection, setExportSelection] = useState<ExportSelection | null>(
    null
  )
  const [deleteManySelection, setDeleteManySelection] =
    useState<BulkDeleteSelection | null>(null)

  return (
    <CustomerGroupsContext
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
    </CustomerGroupsContext>
  )
}

export const useCustomerGroups = () => {
  const customerGroupsContext = React.useContext(CustomerGroupsContext)

  if (!customerGroupsContext) {
    throw new Error(
      "useCustomerGroups has to be used within <CustomerGroupsProvider>"
    )
  }

  return customerGroupsContext
}
