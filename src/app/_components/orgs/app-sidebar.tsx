import CustomSidebarHeader from "@/app/_components/orgs/custom-sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/_components/ui/sidebar";
import { orgNavbarItems } from "@/config/marketing";
import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";
import Link from "next/link";
import { Icons } from "../miscellaneous/lucide-react";

interface AppSidebarProps {
  params: Promise<{ orgname: string }>;
}

export const AppSidebar = async function ({ params }: AppSidebarProps) {
  const slug = await params;
  const { orgname } = slug;
  const session = await getCurrentUser();
  const { uniqueOrg } = await api.org.getOrgBySlug({ orgSlug: orgname });

  return (
    <Sidebar className="bg-background py-5">
      <CustomSidebarHeader />
      <SidebarContent className="bg-background px-3 py-8 flex flex-col items-start justify-start">
        {uniqueOrg?.slug && session?.user.userRole === "org" ? (
          <>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/org/${uniqueOrg.slug}/app`}>
                    <Icons.LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/org/${uniqueOrg.slug}/content/category`}>
                    <Icons.Grid2X2 />
                    <span>Content</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </>
        ) : null}
        <SidebarMenu>
          <h5 className="text-foreground/50 my-4 uppercase font-bold text-subtitle-heading text-left leading-tight tracking-normal font-paragraph  max-w-2xl">
            Study Module
          </h5>
          {orgNavbarItems.map((item, i) => {
            const Icon = Icons[item.icon];
            return (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton asChild>
                  <Link href={`/org/${uniqueOrg?.slug}/${item.url}`}>
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        {session?.user ? (
          <SidebarMenu>
            <h5 className="text-foreground/50 my-4 uppercase font-bold text-subtitle-heading text-left leading-tight tracking-normal font-paragraph  max-w-2xl">
              My Account
            </h5>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={``}>
                  <Icons.User />
                  <span>Me</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : null}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
