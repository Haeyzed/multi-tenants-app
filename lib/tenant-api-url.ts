import { getTenantSubdomainFromHost } from "@/lib/tenant-host"

const TOKEN_KEY = "tenant_token"
const CUSTOMER_TOKEN_KEY = "tenant_customer_token"
export function resolveTenantApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_TENANT_API_URL) {
    return process.env.NEXT_PUBLIC_TENANT_API_URL
  }

  const apiBaseDomain =
    process.env.NEXT_PUBLIC_TENANT_API_BASE_DOMAIN ?? "multi-tenants-api.test"

  if (typeof window === "undefined") {
    return `http://${apiBaseDomain}/api/v1/tenant`
  }

  const subdomain = getTenantSubdomainFromHost(window.location.host)

  if (subdomain) {
    return `http://${subdomain}.${apiBaseDomain}/api/v1/tenant`
  }

  return `http://${apiBaseDomain}/api/v1/tenant`
}

export { TOKEN_KEY as TENANT_TOKEN_KEY, CUSTOMER_TOKEN_KEY as TENANT_CUSTOMER_TOKEN_KEY }
