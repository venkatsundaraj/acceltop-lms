import React, { FC, PropsWithChildren } from "react";
import { Toaster } from "@/app/_components/ui/sonner";
import { getCurrentUser } from "@/lib/session";
import { env } from "@/env";
import { redirect } from "next/navigation";

interface layoutProps {
  children: React.ReactNode;
}

const layout = async ({ children }: layoutProps) => {
  const user = await getCurrentUser();

  if (
    user &&
    user.session &&
    user.user.email &&
    env.ADMIN_EMAIL.includes(user.user.email)
  ) {
    redirect("/super-admin/dashboard");
  }

  return (
    <main className="w-screen h-full flex items-center justify-center bg-background">
      <Toaster />
      {children}
    </main>
  );
};

export default layout;
