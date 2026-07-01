"use client"

import { NavGroup } from "@/components/layout/nav-group"
import { NavUser } from "@/components/tenant/admin/components/nav-user"
import { TeamSwitcher } from "@/components/tenant/admin/components/team-switcher"
import {
  sidebarData,
} from "@/components/tenant/admin/components/sidebar-data"
import { useLayout } from "@/lib/providers/layout-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { collapsible, variant } = useLayout()

  return (
    <Sidebar collapsible={collapsible} variant={variant} {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
