import { FC } from "react";
import { SidebarProvider, SidebarTrigger } from "@/app/_components/ui/sidebar";
import { AppSidebar } from "@/app/_components/orgs/app-sidebar";
import OrgSignoutButton from "@/app/_components/orgs/org-sign-out-button";
import DashboardProvider from "@/app/_components/providers/org-providers/dashboard-provider";
import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

interface layoutProps {
  children: React.ReactNode;
  params: Promise<{ orgname: string }>;
}

const layout = async ({ children, params }: layoutProps) => {
  const { orgname } = await params;
  const user = await api.org.getOrg();
  const session = await getCurrentUser();

  if (!session || !session.user || !session.user.userStatus) {
    notFound();
  }
  if (!user) {
    notFound();
  }

  if (user.status !== "active") {
    redirect("/org/onboarding");
  }

  console.log(session);

  if (user.slug !== orgname || session.user.organizationId !== user.id) {
    return notFound();
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
