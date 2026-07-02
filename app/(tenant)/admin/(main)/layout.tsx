import { AppSidebar } from "@/components/tenant/admin/components/app-sidebar"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { TenantAuthProvider } from "@/lib/providers/tenant-auth-provider"

export default function AdminMainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TenantAuthProvider>
      <DashboardShell sidebar={<AppSidebar />}>
        <TenantAdminAuthGuard>{children}</TenantAdminAuthGuard>
      </DashboardShell>
    </TenantAuthProvider>
  )
}
