import { FC } from "react";
import { SidebarProvider, SidebarTrigger } from "@/app/_components/ui/sidebar";
import { AppSidebar } from "@/app/_components/orgs/app-sidebar";
import OrgSignoutButton from "@/app/_components/orgs/org-sign-out-button";
import DashboardProvider from "@/app/_components/providers/org-providers/dashboard-provider";
import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import OrgUserLogin from "@/app/_components/org-user/org-user-login";

interface pageProps {
  children: React.ReactNode;
  params: Promise<{
    orgname: string;
  }>;
}

const page = async ({ children, params }: pageProps) => {
  return <h1>Hello worl. d</h1>;
};

export default page;
