import { AppSidebar } from "@/components/tenant/admin/components/app-sidebar"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function AdminMainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell sidebar={<AppSidebar />}>{children}</DashboardShell>
  )
}
