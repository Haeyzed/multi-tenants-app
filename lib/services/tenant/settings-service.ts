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

export async function getPublicSettingsForSubdomain(
  subdomain: string
): Promise<PublicSettings | null> {
  const apiBaseDomain =
    process.env.NEXT_PUBLIC_TENANT_API_BASE_DOMAIN ?? "multi-tenants-api.test"

  const baseUrl =
    process.env.NEXT_PUBLIC_TENANT_API_URL ??
    `http://${subdomain}.${apiBaseDomain}/api/v1/tenant`

  try {
    const response = await fetch(`${baseUrl}/settings/public`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return null
    }

    const json = (await response.json()) as ApiResponse<PublicSettings>
    return json.data
  } catch {
    return null
  }
}
