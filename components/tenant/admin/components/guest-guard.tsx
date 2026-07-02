"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { tenantApiClient } from "@/lib/services/tenant/api-client"
import { useGetTenantProfile } from "@/hooks/tenant/use-auth-query"

export function TenantAdminGuestGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const hasToken = !!tenantApiClient.getToken()
  const { data: user, isLoading, isError } = useGetTenantProfile()

  useEffect(() => {
    if (hasToken && !isLoading && user) {
      router.replace("/admin/dashboard")
    }
  }, [hasToken, isLoading, user, router])

  useEffect(() => {
    if (hasToken && isError) {
      tenantApiClient.setToken(null)
    }
  }, [hasToken, isError])

  if (hasToken && (isLoading || user)) {
    return null
  }

  return <>{children}</>
}
