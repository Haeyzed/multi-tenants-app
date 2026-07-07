import {
  BookmarkIcon,
  FolderOpenIcon,
  GalleryVerticalEndIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LayersIcon,
  PackageIcon,
  PercentIcon,
  RulerIcon,
  SettingsIcon,
  ShapesIcon,
  TagIcon,
  TagsIcon,
  TruckIcon,
  UsersIcon,
  UsersRoundIcon,
  WarehouseIcon,
  Boxes,
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
      title: "Customers",
      items: [
        {
          title: "Customers",
          url: "/admin/customers",
          icon: UsersIcon,
        },
        {
          title: "Customer Groups",
          url: "/admin/customer-groups",
          icon: UsersRoundIcon,
        },
      ],
    },
    {
      title: "Catalog",
      items: [
        {
          title: "Products",
          url: "/admin/products",
          icon: PackageIcon,
        },
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
          title: "Tags",
          url: "/admin/tags",
          icon: TagIcon,
        },
        {
          title: "Product Labels",
          url: "/admin/product-labels",
          icon: BookmarkIcon,
        },
        {
          title: "Attributes",
          url: "/admin/attributes",
          icon: ShapesIcon,
        },
        {
          title: "Attribute Sets",
          url: "/admin/attribute-sets",
          icon: LayersIcon,
        },
        {
          title: "Collections",
          url: "/admin/collections",
          icon: FolderOpenIcon,
        },
        {
          title: "Media",
          url: "/admin/media",
          icon: ImageIcon,
        },
      ],
    },
    {
      title: "Inventory",
      items: [
        {
          title: "Stock levels",
          url: "/admin/inventory",
          icon: Boxes,
        },
        {
          title: "Suppliers",
          url: "/admin/suppliers",
          icon: TruckIcon,
        },
        {
          title: "Warehouses",
          url: "/admin/warehouses",
          icon: WarehouseIcon,
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Units",
          url: "/admin/units",
          icon: RulerIcon,
        },
        {
          title: "Tax",
          icon: PercentIcon,
          items: [
            {
              title: "Tax Classes",
              url: "/admin/settings/tax/classes",
              icon: SettingsIcon,
            },
            {
              title: "Tax Zones",
              url: "/admin/settings/tax/zones",
              icon: SettingsIcon,
            },
            {
              title: "Tax Rates",
              url: "/admin/settings/tax/rates",
              icon: SettingsIcon,
            },
            {
              title: "Tax Rules",
              url: "/admin/settings/tax/rules",
              icon: SettingsIcon,
            },
          ],
        },
      ],
    },
  ],
}
