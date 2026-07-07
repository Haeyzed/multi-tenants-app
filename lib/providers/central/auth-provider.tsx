"use client"

import { useGetProfile } from "@/hooks/central/use-auth-query"
import { User } from "@/types/central/user"
import { createContext, useContext, useMemo } from "react"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  hasPermission: (permission: string) => boolean
  isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useGetProfile()

  const isSuperAdmin = useMemo(() => {
    return user?.roles.includes("super-admin") ?? false
  }, [user])

  const hasPermission = (permission: string) => {
    if (isSuperAdmin) {
      return true
    }
    return user?.permissions.includes(permission) ?? false
  }

  const value = {
    user: user || null,
    isLoading,
    hasPermission,
    isSuperAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
