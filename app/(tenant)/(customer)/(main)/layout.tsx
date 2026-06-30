import { AppSidebar } from "@/components/tenant/customer/components/app-sidebar"
import { DashboardShell } from "@/components/layout/dashboard-shell"

export default function CustomerMainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell sidebar={<AppSidebar />}>{children}</DashboardShell>
  )
}
