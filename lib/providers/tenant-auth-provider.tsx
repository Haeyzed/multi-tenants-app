"use client"

import { useGetTenantProfile } from "@/hooks/tenant/use-auth-query"
import { TenantUser } from "@/types/tenant/user"
import { createContext, useContext, useMemo } from "react"

interface TenantAuthContextType {
  user: TenantUser | null
  isLoading: boolean
  hasPermission: (permission: string) => boolean
  isStoreOwner: boolean
}

const TenantAuthContext = createContext<TenantAuthContextType | undefined>(
  undefined
)

export function TenantAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user, isLoading } = useGetTenantProfile()

  const isStoreOwner = useMemo(() => {
    return user?.roles.includes("store-owner") ?? false
  }, [user])

  const hasPermission = (permission: string) => {
    if (isStoreOwner) {
      return true
    }

    return user?.permissions.includes(permission) ?? false
  }

  const value = {
    user: user || null,
    isLoading,
    hasPermission,
    isStoreOwner,
  }

  return (
    <TenantAuthContext.Provider value={value}>
      {children}
    </TenantAuthContext.Provider>
  )
}

export function useTenantAuth() {
  const context = useContext(TenantAuthContext)

  if (context === undefined) {
    throw new Error("useTenantAuth must be used within a TenantAuthProvider")
  }

  return context
}
