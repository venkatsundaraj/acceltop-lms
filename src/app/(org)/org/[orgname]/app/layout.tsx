import { FC } from "react";
import { SidebarProvider, SidebarTrigger } from "@/app/_components/ui/sidebar";
import { AppSidebar } from "@/app/_components/orgs/app-sidebar";
import OrgSignoutButton from "@/app/_components/orgs/org-sign-out-button";
import DashboardProvider from "@/app/_components/providers/org-providers/dashboard-provider";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

interface layoutProps {
  children: React.ReactNode;
}

const layout = async ({ children }: layoutProps) => {
  const user = await api.org.getOrg();

  if (!user) {
    notFound();
  }

  return (
    <DashboardProvider>
      <SidebarProvider>
        <AppSidebar user={user} />
        <main className="w-full">
          <nav className="w-full ">
            <div className="container flex items-center justify-between py-4">
              <SidebarTrigger />
              <OrgSignoutButton />
            </div>
          </nav>
          {children}
        </main>
      </SidebarProvider>
    </DashboardProvider>
  );
};

export default layout;
