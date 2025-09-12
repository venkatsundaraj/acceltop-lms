import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { FC } from "react";

interface DashboardProviderProps {
  children: React.ReactNode;
}

const DashboardProvider = async ({ children }: DashboardProviderProps) => {
  const user = await api.org.getOrg();

  if (!user || !user.id) {
    return notFound();
  }
  return <>{children}</>;
};

export default DashboardProvider;
