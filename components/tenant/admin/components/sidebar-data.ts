import { GalleryVerticalEndIcon, LayoutDashboardIcon } from "lucide-react"
import type { SidebarData } from "@/components/layout/types"

export const sidebarUser = {
  name: "Admin",
  email: "admin@example.com",
  avatar: "",
}

export const sidebarData: SidebarData = {
  teams: [
    {
      name: "Tenant Admin",
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
          url: "/admin/dashboard",
          icon: LayoutDashboardIcon,
        },
      ],
    },
  ],
}
