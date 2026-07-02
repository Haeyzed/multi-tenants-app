"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { apiClient } from "@/lib/services/central/api-client"
import { useGetProfile } from "@/hooks/central/use-auth-query"

export function CentralGuestGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const hasToken = !!apiClient.getToken()
  const { data: user, isLoading, isError } = useGetProfile()

  useEffect(() => {
    if (hasToken && !isLoading && user) {
      router.replace("/central/dashboard")
    }
  }, [hasToken, isLoading, user, router])

  useEffect(() => {
    if (hasToken && isError) {
      apiClient.setToken(null)
    }
  }, [hasToken, isError])

  if (hasToken && (isLoading || user)) {
    return null
  }

  return <>{children}</>
}
