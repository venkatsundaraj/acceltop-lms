import React, { FC, PropsWithChildren } from "react";
import SuperAdminAuthProvider from "@/app/_components/providers/super-admin-auth-provider";

interface layoutProps {
  children: React.ReactNode;
}

const layout = async ({ children }: layoutProps) => {
  return (
    <main className="w-screen max-h-screen h-full flex items-center justify-center bg-background">
      {children}
    </main>
  );
};

export default layout;
