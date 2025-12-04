"use client";

import { FC } from "react";
import { useOrgContext } from "@/app/_components/providers/org-providers/org-provider";
import { useOrgUserContext } from "@/app/_components/providers/org-providers/org-user-provider";
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

interface CustomSidebarHeaderProps {}

const CustomSidebarHeader: FC<CustomSidebarHeaderProps> = ({}) => {
  const { org, sessionUser } = useOrgContext();
  const { orgUser } = useOrgUserContext();
  return (
    <SidebarHeader className="!bg-none p-0">
      {org && sessionUser.role === "org" ? (
        <h4 className="text-primary uppercase font-bold text-subtitle-heading text-center leading-tight tracking-normal font-paragraph  max-w-2xl">
          {org.name}
        </h4>
      ) : orgUser && sessionUser.role === "org_user" ? (
        <h4 className="text-primary uppercase font-bold text-subtitle-heading text-center leading-tight tracking-normal font-paragraph  max-w-2xl">
          {sessionUser.name}
        </h4>
      ) : (
        ""
      )}
    </SidebarHeader>
  );
};

export default CustomSidebarHeader;
