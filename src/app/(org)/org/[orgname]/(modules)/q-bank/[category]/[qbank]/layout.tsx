import { QbankProvider } from "@/app/_components/providers/module-providers/q-bank-provider";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import { FC, PropsWithChildren } from "react";

interface layoutProps extends PropsWithChildren {}

const layout = async ({ children }: layoutProps) => {
  const session = await getCurrentUser();

  if (!session || session.user.userRole !== "org") {
    notFound();
  }
  return <QbankProvider>{children}</QbankProvider>;
};

export default layout;
