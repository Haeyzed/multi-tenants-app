"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { CheckIcon, MoonIcon, SunIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const themeColor = theme === "dark" ? "#020817" : "#fff"
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute("content", themeColor)
  }, [theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="scale-95 rounded-full" />
        }
      >
        <SunIcon className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
          <CheckIcon
            size={14}
            className={cn("ms-auto", theme !== "light" && "hidden")}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
          <CheckIcon
            size={14}
            className={cn("ms-auto", theme !== "dark" && "hidden")}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
          <CheckIcon
            size={14}
            className={cn("ms-auto", theme !== "system" && "hidden")}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
