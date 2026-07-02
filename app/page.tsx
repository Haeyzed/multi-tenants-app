import { headers } from "next/headers"
import { CentralLandingPage } from "@/components/central/landing/central-landing-page"
import { TenantLandingPage } from "@/components/tenant/landing/tenant-landing-page"
import { getTenantSubdomainFromHost } from "@/lib/tenant-host"

export default async function HomePage() {
  const host = (await headers()).get("host") ?? ""
  const subdomain = getTenantSubdomainFromHost(host)

  if (subdomain) {
    return <TenantLandingPage subdomain={subdomain} />
  }

  return <CentralLandingPage />
}
