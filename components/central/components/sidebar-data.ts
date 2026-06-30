import {
  CreditCardIcon,
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from "lucide-react"
import type { SidebarData } from "@/components/layout/types"

export const sidebarData: SidebarData = {
  teams: [
    {
      name: "Central",
      logo: GalleryVerticalEndIcon,
      plan: "Enterprise",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/central/dashboard",
          icon: LayoutDashboardIcon,
        },
        {
          title: "Tenants",
          url: "/central/tenants",
          icon: UsersIcon,
        },
        {
          title: "Plans",
          url: "/central/plans",
          icon: CreditCardIcon,
        },
      ],
    },
  ],
}
