import OrgUserLogin from "@/app/_components/org-user/org-user-login";
import OrgUserLogout from "@/app/_components/org-user/org-user-logout";
import { AppSidebar } from "@/app/_components/orgs/app-sidebar";
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
  const orgUser = await api.orgUser.getOrgUser();
  console.log(uniqueOrg);

  const data = await db.select({ data: user.id }).from(user);
  console.log("data", data);

  if (
    uniqueOrg &&
    session?.user.userRole === "org" &&
    uniqueOrg.status !== "active"
  ) {
    redirect("/org/onboarding");
  }
  if (uniqueOrg?.slug !== orgname) {
    notFound();
  }

  return (
    <DashboardProvider
    // initialConfig={{ user: session?.user, uniqueOrg }}
    >
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <nav className="w-full ">
            <div className="container flex items-center justify-between py-4">
              <SidebarTrigger />
              {session &&
              session.user.userRole === "org" &&
              uniqueOrg?.slug === orgname ? (
                <OrgSignoutButton />
              ) : orgUser && session?.user.userRole === "org_user" ? (
                <OrgUserLogout />
              ) : (
                <OrgUserLogin />
              )}
            </div>
          </nav>
          {children}
        </main>
      </SidebarProvider>
    </DashboardProvider>
  );
};

export default layout;
