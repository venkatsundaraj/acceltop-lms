import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function SuperAdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await api.admin.checkAuthStatus();

  if (!session) {
    redirect("/super-admin/login");
  }

  if (session && session.user?.userRole === "admin") {
    redirect("/super-admin/dashboard");
  }

  return <>{children}</>;
}
