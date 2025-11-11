import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { FC } from "react";
import { OrgContextProvider } from "@/app/_components/providers/org-providers/org-provider";
import { User } from "better-auth";
import { UserSchema } from "@/server/db/schema";
import { OrgUserSchema } from "@/server/db/organisation-user";
import { OrgSchema } from "@/server/db/organisation";

interface DashboardProviderProps {
  children: React.ReactNode;
  initialConfig?: {
    user: UserSchema;
    orgUser: OrgUserSchema;
    uniqueOrg: OrgSchema;
  };
}

const DashboardProvider = async ({ children }: DashboardProviderProps) => {
  return <OrgContextProvider>{children}</OrgContextProvider>;
};

export default DashboardProvider;
