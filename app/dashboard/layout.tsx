import Logo from "@/components/logo";
import SidebarMain from "@/components/dashboard/sidebar-main";
import SidebarUser from "@/components/dashboard/sidebar-user";
import DashboardTitle from "@/components/dashboard/dashboard-title";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { Separator } from "@/components/ui/separator";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex gap-x-2 items-center">
            <Logo width={32} className="flex-shrink-0" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Acme Inc</span>
              <span className="truncate text-xs">Enterprise</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMain />
        </SidebarContent>
        <SidebarFooter>
          <SidebarUser user={session?.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="overflow-x-hidden">
        <div className="flex flex-col h-svh">
          <header className="border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center justify-between w-full gap-x-2 px-4">
              <div className="flex items-center w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <DashboardTitle />
              </div>
            </div>
          </header>

          <div className="scroll-area">
            <div className="p-4">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const metadata = {
  title: `Dashboard | Acme Inc`,
  description: `Dashboard | Acme Inc`,
};
