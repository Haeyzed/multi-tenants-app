import {
  GalleryVerticalEndIcon,
  ImageIcon,
  LayoutDashboardIcon,
  TagIcon,
  TagsIcon,
} from "lucide-react"
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
    {
      title: "Catalog",
      items: [
        {
          title: "Brands",
          url: "/admin/brands",
          icon: TagIcon,
        },
        {
          title: "Categories",
          url: "/admin/categories",
          icon: TagsIcon,
        },
        {
          title: "Media",
          url: "/admin/media",
          icon: ImageIcon,
        },
      ],
    },
  ],
}
