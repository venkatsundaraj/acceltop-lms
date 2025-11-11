import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout = async ({ children }: layoutProps) => {
  const session = await getCurrentUser();

  if (!session || session.user.userRole !== "org") {
    notFound();
  }

  return <>{children}</>;
};

export default layout;
