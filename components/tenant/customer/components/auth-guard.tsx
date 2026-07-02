"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useCustomerAuth } from "@/lib/providers/tenant/customer-auth-provider"
import { tenantCustomerApiClient } from "@/lib/services/tenant/api-client"

export function CustomerAuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, isLoading } = useCustomerAuth()
  const router = useRouter()

  useEffect(() => {
    if (!tenantCustomerApiClient.getToken()) {
      router.replace("/login")
      return
    }

    if (!isLoading && !profile) {
      router.replace("/login")
    }
  }, [profile, isLoading, router])

  if (!tenantCustomerApiClient.getToken() || isLoading || !profile) {
    return null
  }

  return <>{children}</>
}
