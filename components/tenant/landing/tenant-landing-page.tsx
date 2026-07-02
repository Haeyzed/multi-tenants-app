import Link from "next/link"
import { GalleryVerticalEndIcon, LogIn, ShoppingBag, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPublicSettingsForSubdomain } from "@/lib/services/tenant/settings-service"

type TenantLandingPageProps = {
  subdomain: string
}

export async function TenantLandingPage({ subdomain }: TenantLandingPageProps) {
  const settings = await getPublicSettingsForSubdomain(subdomain)
  const brandName =
    settings?.brand_name ??
    settings?.store_name ??
    settings?.business_name ??
    subdomain

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            <span className="text-lg font-semibold">{brandName}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" render={<Link href="/login" />}>
              Sign in
            </Button>
            <Button render={<Link href="/signup" />}>Create account</Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {subdomain}
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome to {brandName}
          </h1>
          <p className="text-lg text-muted-foreground">
            Shop flash sales, track orders, and manage your store experience
            from one place.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/signup" />}>
              <ShoppingBag className="mr-2 size-4" />
              Start shopping
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/login" />}>
              <LogIn className="mr-2 size-4" />
              Customer sign in
            </Button>
            <Button size="lg" variant="secondary" render={<Link href="/admin/login" />}>
              <Store className="mr-2 size-4" />
              Store admin
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Powered by Multi-Tenants
      </footer>
    </div>
  )
}
