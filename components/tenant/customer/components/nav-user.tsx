"use client"

import * as React from "react"
import { useCustomerAuth } from "@/lib/providers/tenant/customer-auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, } from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react"
import { CustomerSignOutDialog } from "@/components/tenant/customer/components/sign-out-dialog"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { profile } = useCustomerAuth()
  const [signOutOpen, setSignOutOpen] = React.useState(false)

  if (!profile) {
    return null
  }

  const displayName =
    profile.customer.full_name || profile.user.name || profile.user.email

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
              }
            >
              <Avatar>
                <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{profile.user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ms-auto size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-fit"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                    <Avatar>
                      <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-start text-sm leading-tight">
                      <span className="truncate font-medium">{displayName}</span>
                      <span className="truncate text-xs">
                        {profile.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setSignOutOpen(true)}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CustomerSignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} />
    </>
  )
}
