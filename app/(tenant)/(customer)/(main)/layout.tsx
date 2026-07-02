import { AppSidebar } from "@/components/tenant/customer/components/app-sidebar"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { CustomerAuthProvider } from "@/lib/providers/customer-auth-provider"

export default function CustomerMainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CustomerAuthProvider>
      <DashboardShell sidebar={<AppSidebar />}>{children}</DashboardShell>
    </CustomerAuthProvider>
  )
}
