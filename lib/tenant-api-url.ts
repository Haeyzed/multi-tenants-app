const TOKEN_KEY = "tenant_token"

export function resolveTenantApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_TENANT_API_URL) {
    return process.env.NEXT_PUBLIC_TENANT_API_URL
  }

  const apiBaseDomain =
    process.env.NEXT_PUBLIC_TENANT_API_BASE_DOMAIN ?? "multi-tenants-api.test"

  if (typeof window === "undefined") {
    return `http://${apiBaseDomain}/api/v1/tenant`
  }

  const hostname = window.location.hostname
  const parts = hostname.split(".")

  if (parts.length >= 2 && parts[0] && parts[0] !== "www") {
    return `http://${parts[0]}.${apiBaseDomain}/api/v1/tenant`
  }

  return `http://${apiBaseDomain}/api/v1/tenant`
}

export { TOKEN_KEY as TENANT_TOKEN_KEY }
