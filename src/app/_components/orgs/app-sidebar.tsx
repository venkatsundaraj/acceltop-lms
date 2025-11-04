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
import { OrgSchema, UserSchema } from "@/server/db/schema";
import { FC } from "react";
import { orgNavbarItems } from "@/config/marketing";
import Link from "next/link";
import { Icons } from "../miscellaneous/lucide-react";
import { getCurrentUser } from "@/lib/session";

interface AppSidebarProps {
  user: OrgSchema;
}

export const AppSidebar = async function ({ user }: AppSidebarProps) {
  const session = await getCurrentUser();

  return (
    <Sidebar className="bg-background py-5">
      <SidebarHeader className="bg-transparent">
        <h4 className="text-primary uppercase font-bold text-paragraph-heading text-center leading-tight tracking-normal font-paragraph  max-w-2xl">
          {user.name ?? user.name}
        </h4>
      </SidebarHeader>
      <SidebarContent className="bg-background px-3 py-8 flex flex-col items-start justify-start gap-6">
        {session?.user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`/org/${user.slug}/app`}>
                  <Icons.LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : null}
        <SidebarMenu>
          <h5 className="text-foreground/50 mb-4 uppercase font-bold text-subtitle-heading text-left leading-tight tracking-normal font-paragraph  max-w-2xl">
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
