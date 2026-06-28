import { Geist, Geist_Mono, Inter } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import TanstackProvider from "@/lib/providers/tanstack-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
    <body>
    <ThemeProvider>
      <TanstackProvider>
        <TooltipProvider>
          <NuqsAdapter>
            {children}
          </NuqsAdapter>
        </TooltipProvider>
      </TanstackProvider>
    </ThemeProvider>
    </body>
    </html>
  )
}