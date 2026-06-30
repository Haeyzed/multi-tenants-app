"use client"

import { getCookie } from "@/lib/cookies"
import { cn } from "@/lib/utils"
import { LayoutProvider } from "@/lib/providers/layout-provider"
import { SearchProvider } from "@/lib/providers/search-provider"
import { DirectionProvider } from "@/lib/providers/direction-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SkipToMain } from "@/components/skip-to-main"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { ConfigDrawer } from "@/components/config-drawer"

type DashboardShellProps = {
  sidebar: React.ReactNode
  children: React.ReactNode
  commandMenu?: React.ReactNode
}

export function DashboardShell({
  sidebar,
  children,
  commandMenu,
}: DashboardShellProps) {
  const defaultOpen = getCookie("sidebar_state") !== "false"

  return (
    <DirectionProvider>
      <SearchProvider>
        <LayoutProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <SkipToMain />
            {sidebar}
            {commandMenu}
            <SidebarInset
              className={cn(
                "@container/content",
                "has-data-[layout=fixed]:h-svh",
                "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]"
              )}
            >
              <Header>
                {commandMenu && <Search className="me-auto" />}
                <ThemeSwitch />
                <ConfigDrawer />
              </Header>
              <Main>{children}</Main>
            </SidebarInset>
          </SidebarProvider>
        </LayoutProvider>
      </SearchProvider>
    </DirectionProvider>
  )
}
