"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { tenantCustomerApiClient } from "@/lib/services/tenant/api-client"
import { useGetCustomerProfile } from "@/hooks/tenant/use-customer-auth-query"

export function CustomerGuestGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const hasToken = !!tenantCustomerApiClient.getToken()
  const { data: profile, isLoading, isError } = useGetCustomerProfile()

  useEffect(() => {
    if (hasToken && !isLoading && profile) {
      router.replace("/dashboard")
    }
  }, [hasToken, isLoading, profile, router])

  useEffect(() => {
    if (hasToken && isError) {
      tenantCustomerApiClient.setToken(null)
    }
  }, [hasToken, isError])

  if (hasToken && (isLoading || profile)) {
    return null
  }

  return <>{children}</>
}
