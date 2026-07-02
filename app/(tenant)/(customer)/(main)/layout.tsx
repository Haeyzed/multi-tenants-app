import { AppSidebar } from "@/components/tenant/customer/components/app-sidebar"
import { CustomerAuthGuard } from "@/components/tenant/customer/components/auth-guard"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { CustomerAuthProvider } from "@/lib/providers/customer-auth-provider"

export default function CustomerMainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CustomerAuthProvider>
      <DashboardShell sidebar={<AppSidebar />}>
        <CustomerAuthGuard>{children}</CustomerAuthGuard>
      </DashboardShell>
    </CustomerAuthProvider>
  )
}
