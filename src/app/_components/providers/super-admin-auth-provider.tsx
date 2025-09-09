"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SuperAdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await authClient.getSession();
      const user = await data?.user;

      if (!user) {
        router.push("/super-admin/login");
        return;
      }

      if (user.userRole !== "admin" && pathname.startsWith("/super-admin")) {
        router.push("/super-admin/login");
      }

      if (
        user &&
        user.userRole === "admin" &&
        pathname.startsWith("/super-admin")
      ) {
        router.push("/super-admin/dashboard");
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>;
}
