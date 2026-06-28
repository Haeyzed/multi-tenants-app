"use client"

import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import { type Tenant } from "@/types/central/tenant"

type TenantsDialogType = "create" | "update" | "delete" | "import"

type TenantsContextType = {
  open: TenantsDialogType | null
  setOpen: (str: TenantsDialogType | null) => void
  currentRow: Tenant | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Tenant | null>>
}

const TenantsContext = React.createContext<TenantsContextType | null>(null)

export function TenantsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TenantsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Tenant | null>(null)

  return (
    <TenantsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TenantsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTenants = () => {
  const tenantsContext = React.useContext(TenantsContext)

  if (!tenantsContext) {
    throw new Error("useTenants has to be used within <TenantsProvider>")
  }

  return tenantsContext
}
