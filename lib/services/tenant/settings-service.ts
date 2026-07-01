import { tenantApiClient } from "./api-client"
import { PublicSettings } from "@/types/tenant/settings"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const getPublicSettings = async (): Promise<PublicSettings> => {
  const response =
    await tenantApiClient.get<ApiResponse<PublicSettings>>("/settings/public")
  return response.data
}
