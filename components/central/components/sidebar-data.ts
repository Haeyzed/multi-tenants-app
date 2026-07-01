import {
  Building2Icon,
  CreditCardIcon,
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  UserRoundIcon,
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
          icon: Building2Icon,
        },
        {
          title: "Plans",
          url: "/central/plans",
          icon: CreditCardIcon,
        },
        {
          title: "Users",
          url: "/central/users",
          icon: UserRoundIcon,
        },
      ],
    },
  ],
}
