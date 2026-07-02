"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useTenantAuth } from "@/lib/providers/tenant/tenant-auth-provider"
import { tenantApiClient } from "@/lib/services/tenant/api-client"

export function TenantAdminAuthGuard({
  children,
  permissions,
}: {
  children: React.ReactNode
  permissions?: string | string[]
}) {
  const { user, isLoading, hasPermission, isStoreOwner } = useTenantAuth()
  const router = useRouter()

  useEffect(() => {
    if (!tenantApiClient.getToken()) {
      router.replace("/admin/login")
      return
    }

    if (!isLoading && !user) {
      router.replace("/admin/login")
    }
  }, [user, isLoading, router])

  if (!tenantApiClient.getToken() || isLoading || !user) {
    return null
  }

  if (permissions) {
    const required = Array.isArray(permissions) ? permissions : [permissions]
    const canAccess =
      isStoreOwner || required.every((permission) => hasPermission(permission))

    if (!canAccess) {
      return null
    }
  }

  return <>{children}</>
}
