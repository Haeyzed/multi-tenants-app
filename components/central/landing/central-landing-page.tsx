import Link from "next/link"
import { GalleryVerticalEndIcon, LayoutDashboard, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CentralLandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            <span className="text-lg font-semibold">Multi-Tenants</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" render={<Link href="/central/login" />}>
              Sign in
            </Button>
            <Button render={<Link href="/central/register" />}>
              Get started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Run every flash-sale store from one platform
          </h1>
          <p className="text-lg text-muted-foreground">
            Central admin for tenants, plans, billing, and provisioning. Create
            stores, manage domains, and onboard owners in minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/central/register" />}>
              Create central account
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/central/login" />}
            >
              <LogIn className="mr-2 size-4" />
              Sign in to admin
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Platform administration ·{" "}
        <Link
          href="/central/dashboard"
          className="underline underline-offset-4"
        >
          <LayoutDashboard className="mr-1 inline size-3.5" />
          Dashboard
        </Link>
      </footer>
    </div>
  )
}
