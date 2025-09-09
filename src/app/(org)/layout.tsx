import React, { FC, PropsWithChildren } from "react";
import OrgAuthProvider from "@/app/_components/providers/org-auth-provider";

interface layoutProps {
  children: React.ReactNode;
}

const layout = async ({ children }: layoutProps) => {
  return (
    <main className="w-screen max-h-screen h-full flex items-center justify-center bg-background">
      <OrgAuthProvider>{children}</OrgAuthProvider>
    </main>
  );
};

export default layout;
