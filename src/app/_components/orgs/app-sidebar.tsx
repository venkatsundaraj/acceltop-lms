import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/_components/ui/sidebar";
import { UserSchema } from "@/server/db/schema";
import { OrgSchema } from "@/server/db/organisation";
import { FC } from "react";
import { orgNavbarItems } from "@/config/marketing";
import Link from "next/link";
import { Icons } from "../miscellaneous/lucide-react";
import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";

interface AppSidebarProps {
  // user: OrgSchema;
}

export const AppSidebar = async function ({}: AppSidebarProps) {
  const session = await getCurrentUser();
  const org = await api.org.getOrg();

  return (
    <Sidebar className="bg-background py-5">
      {org?.name ? (
        <SidebarHeader className="bg-transparent">
          <h4 className="text-primary uppercase font-bold text-paragraph-heading text-center leading-tight tracking-normal font-paragraph  max-w-2xl">
            {org.name}
          </h4>
        </SidebarHeader>
      ) : null}
      <SidebarContent className="bg-background px-3 py-8 flex flex-col items-start justify-start">
        {org?.slug ? (
          <>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/org/${org.slug}/app`}>
                    <Icons.LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/org/${org.slug}/app/content/category`}>
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
                  <Link href={item.url}>
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
            <h5 className="text-foreground/50 mb-4 uppercase font-bold text-subtitle-heading text-left leading-tight tracking-normal font-paragraph  max-w-2xl">
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
