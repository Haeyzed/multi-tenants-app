"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ReactNode } from "react"
import { ChevronRightIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  type NavCollapsible,
  type NavGroup as NavGroupProps,
  type NavItem,
  type NavLink,
} from "@/components/layout/types"

export function NavGroup({ title, items }: NavGroupProps) {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${"url" in item ? item.url : "collapsible"}`

          if (!("items" in item) || !item.items) {
            return (
              <SidebarMenuLink key={key} item={item} pathname={pathname} />
            )
          }

          if (state === "collapsed" && !isMobile) {
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item}
                pathname={pathname}
              />
            )
          }

          return (
            <SidebarMenuCollapsible
              key={key}
              item={item}
              pathname={pathname}
            />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
}

function SidebarMenuLink({
  item,
  pathname,
}: {
  item: NavLink
  pathname: string
}) {
  const { setOpenMobile } = useSidebar()
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={item.url} />}
        isActive={checkIsActive(pathname, item)}
        tooltip={item.title}
        onClick={() => setOpenMobile(false)}
      >
        {Icon && <Icon />}
        <span>{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({
  item,
  pathname,
}: {
  item: NavCollapsible
  pathname: string
}) {
  const { setOpenMobile } = useSidebar()
  const Icon = item.icon

  return (
    <Collapsible
      defaultOpen={checkIsActive(pathname, item, true)}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} />}>
        {Icon && <Icon />}
        <span>{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
        <ChevronRightIcon className="ms-auto transition-transform duration-200 group-data-open/collapsible:rotate-90 rtl:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items.map((subItem) => {
            const SubIcon = subItem.icon

            return (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  render={<Link href={subItem.url} />}
                  isActive={checkIsActive(pathname, subItem)}
                  onClick={() => setOpenMobile(false)}
                >
                  {SubIcon && <SubIcon />}
                  <span>{subItem.title}</span>
                  {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({
  item,
  pathname,
}: {
  item: NavCollapsible
  pathname: string
}) {
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton
              tooltip={item.title}
              isActive={checkIsActive(pathname, item)}
            />
          }
        >
          {Icon && <Icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => {
            const SubIcon = sub.icon

            return (
              <DropdownMenuItem
                key={`${sub.title}-${sub.url}`}
                render={<Link href={sub.url} />}
                className={
                  checkIsActive(pathname, sub) ? "bg-secondary" : undefined
                }
              >
                {SubIcon && <SubIcon />}
                <span className="max-w-52 text-wrap">{sub.title}</span>
                {sub.badge && (
                  <span className="ms-auto text-xs">{sub.badge}</span>
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(pathname: string, item: NavItem, mainNav = false) {
  const url = "url" in item ? item.url : undefined

  return (
    pathname === url ||
    pathname.split("?")[0] === url ||
    (!!("items" in item) &&
      item.items?.some((i) => i.url === pathname)) ||
    (mainNav &&
      !!url &&
      pathname.split("/")[1] !== "" &&
      pathname.split("/")[1] === url.split("/")[1])
  )
}
