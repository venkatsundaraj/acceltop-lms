import OrgUserLogin from "@/app/_components/org-user/org-user-login";
import OrgUserLogout from "@/app/_components/org-user/org-user-logout";
import { AppSidebar } from "@/app/_components/orgs/app-sidebar";
import DynamicAuthBtn from "@/app/_components/orgs/dynamic-auth-btn";
import OrgSignoutButton from "@/app/_components/orgs/org-sign-out-button";
import DashboardProvider from "@/app/_components/providers/org-providers/dashboard-provider";
import { SidebarProvider, SidebarTrigger } from "@/app/_components/ui/sidebar";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/server/db";
import { organisation } from "@/server/db/organisation";
import { user } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { getTableColumns, sql } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

interface layoutProps {
  children: React.ReactNode;
  params: Promise<{ orgname: string }>;
}

const layout = async ({ children, params }: layoutProps) => {
  const { orgname } = await params;
  const { uniqueOrg } = await api.org.getOrgBySlug({ orgSlug: orgname });
  const session = await getCurrentUser();

  if (
    uniqueOrg &&
    session?.user.userRole === "org" &&
    uniqueOrg.status !== "active"
  ) {
    redirect("/org/onboarding");
  }
  console.log(uniqueOrg?.slug, orgname);
  if (uniqueOrg?.slug.trim() !== orgname.trim()) {
    console.log("server", true);
    notFound();
  }

  return (
    <DashboardProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <nav className="w-full ">
            <div className="container flex items-center justify-between py-4">
              <SidebarTrigger />
              <DynamicAuthBtn />
            </div>
          </nav>
          {children}
        </main>
      </SidebarProvider>
    </DashboardProvider>
  );
};

export default layout;
