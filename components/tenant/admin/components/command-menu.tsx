"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  ArrowRightIcon,
  ChevronRightIcon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react"
import { useSearch } from "@/lib/providers/search-provider"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { sidebarData } from "./sidebar-data"

export function CommandMenu() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-none bg-transparent">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.flatMap((navItem, i) => {
                if ("url" in navItem && navItem.url) {
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => router.push(navItem.url))
                      }}
                    >
                      <div className="flex size-4 items-center justify-center">
                        <ArrowRightIcon className="size-2 text-muted-foreground/80" />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  )
                }

                return (
                  navItem.items?.map((subItem, subIndex) => (
                    <CommandItem
                      key={`${navItem.title}-${subItem.url}-${subIndex}`}
                      value={`${navItem.title}-${subItem.url}`}
                      onSelect={() => {
                        runCommand(() => router.push(subItem.url))
                      }}
                    >
                      <div className="flex size-4 items-center justify-center">
                        <ArrowRightIcon className="size-2 text-muted-foreground/80" />
                      </div>
                      {navItem.title} <ChevronRightIcon /> {subItem.title}
                    </CommandItem>
                  )) ?? []
                )
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <SunIcon /> <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <MoonIcon className="scale-90" />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <LaptopIcon />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
