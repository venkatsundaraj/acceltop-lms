import React, { FC, PropsWithChildren } from "react";
import { Toaster } from "@/app/_components/ui/sonner";

interface layoutProps {
  children: React.ReactNode;
}

const layout = async ({ children }: layoutProps) => {
  return (
    <main className="w-screen max-h-screen h-full flex items-center justify-center bg-background">
      <Toaster />
      {children}
    </main>
  );
};

export default layout;
