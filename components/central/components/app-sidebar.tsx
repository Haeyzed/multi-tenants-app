"use client"

import * as React from "react"

import { NavMain } from "@/components/central/components/nav-main"
import { NavUser } from "@/components/central/components/nav-user"
import { TeamSwitcher } from "@/components/central/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, LayoutDashboard, Users, CreditCard } from "lucide-react"

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Central",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/central/dashboard",
      icon: (
        <LayoutDashboard
        />
      ),
    },
    {
      title: "Tenants",
      url: "/central/tenants",
      icon: (
        <Users
        />
      ),
    },
    {
      title: "Plans",
      url: "/central/plans",
      icon: (
        <CreditCard
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}