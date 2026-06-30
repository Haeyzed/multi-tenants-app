import { GalleryVerticalEndIcon, LayoutDashboardIcon } from "lucide-react"
import type { SidebarData } from "@/components/layout/types"

export const sidebarUser = {
  name: "Customer",
  email: "customer@example.com",
  avatar: "",
}

export const sidebarData: SidebarData = {
  teams: [
    {
      name: "Tenant",
      logo: GalleryVerticalEndIcon,
      plan: "Pro",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboardIcon,
        },
      ],
    },
  ],
}
