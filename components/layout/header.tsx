"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener("scroll", onScroll, { passive: true })
    return () => document.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "z-50 h-16 shrink-0",
        fixed && "header-fixed peer/header sticky top-0 w-[inherit]",
        offset > 10 && fixed ? "shadow" : "shadow-none",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "relative flex h-full items-center gap-3 px-4 sm:gap-4",
          offset > 10 &&
            fixed &&
            "after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg"
        )}
      >
        <SidebarTrigger className="-ms-1 max-md:scale-125" />
        <Separator
          orientation="vertical"
          className="me-2 data-vertical:h-4 data-vertical:self-auto"
        />
        {children}
      </div>
    </header>
  )
}
