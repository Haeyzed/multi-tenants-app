import { AppSidebar } from "@/components/central/components/app-sidebar"
import { CommandMenu } from "@/components/central/components/command-menu"
import { Guard } from "@/components/central/components/auth/guard"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { AuthProvider } from "@/lib/providers/auth-provider"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DashboardShell
        sidebar={<AppSidebar />}
        commandMenu={<CommandMenu />}
      >
        <Guard>{children}</Guard>
      </DashboardShell>
    </AuthProvider>
  )
}
