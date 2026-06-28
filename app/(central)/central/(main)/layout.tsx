import { AppSidebar } from "@/components/central/components/app-sidebar";
import { Guard } from "@/components/central/components/auth/guard";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AuthProvider } from "@/lib/providers/auth-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ms-1" />
              <Separator
                orientation="vertical"
                className="me-2 data-vertical:h-4 data-vertical:self-auto"
              />
              {/* Breadcrumbs will be rendered by child pages */}
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Guard>{children}</Guard>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}