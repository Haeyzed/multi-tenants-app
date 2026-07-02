const CENTRAL_HOSTS = new Set(["localhost", "127.0.0.1"])

export function getHostnameFromHost(host: string): string {
  return host.split(":")[0].toLowerCase()
}

/**
 * Returns the tenant subdomain when the request is on a tenant host
 * (e.g. tenant1.localhost), or null for the central platform host.
 */
export function getTenantSubdomainFromHost(host: string): string | null {
  const hostname = getHostnameFromHost(host)

  if (CENTRAL_HOSTS.has(hostname)) {
    return null
  }

  const parts = hostname.split(".")

  if (parts.length < 2 || !parts[0] || parts[0] === "www") {
    return null
  }

  return parts[0]
}

export function isCentralHost(host: string): boolean {
  return getTenantSubdomainFromHost(host) === null
}
