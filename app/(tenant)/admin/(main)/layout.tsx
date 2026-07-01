import { AppSidebar } from "@/components/tenant/admin/components/app-sidebar"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { TenantAuthProvider } from "@/lib/providers/tenant-auth-provider"

export default function AdminMainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TenantAuthProvider>
      <DashboardShell sidebar={<AppSidebar />}>{children}</DashboardShell>
    </TenantAuthProvider>
  )
}
