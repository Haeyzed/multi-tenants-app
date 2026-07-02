"use client"

import { useGetCustomerProfile } from "@/hooks/tenant/use-customer-auth-query"
import { CustomerProfile } from "@/types/tenant/customer"
import { createContext, useContext } from "react"

interface CustomerAuthContextType {
  profile: CustomerProfile | null
  isLoading: boolean
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(
  undefined
)

export function CustomerAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: profile, isLoading } = useGetCustomerProfile()

  const value = {
    profile: profile || null,
    isLoading,
  }

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext)

  if (context === undefined) {
    throw new Error(
      "useCustomerAuth must be used within a CustomerAuthProvider"
    )
  }

  return context
}
