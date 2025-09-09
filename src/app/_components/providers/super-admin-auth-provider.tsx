"use client";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import React, {
  FC,
  useEffect,
  createContext,
  useContext,
  useState,
} from "react";

interface SuperAdminAuthProviderProps {
  children: React.ReactNode;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any | null;
}

const SuperAdminAuthContext = createContext<AuthState | null>(null);

export const useSuperAdminAuth = () => {
  const context = useContext(SuperAdminAuthContext);
  if (!context) {
    throw new Error(
      "useSuperAdminAuth must be used within SuperAdminAuthProvider"
    );
  }
  return context;
};

const SuperAdminAuthProvider: FC<SuperAdminAuthProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    user: null,
  });

  const getCurrentUserWithRole = async () => {
    try {
      const { data } = await authClient.getSession();
      if (!data?.user.id) {
        return null;
      }

      return data.user;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  };

  const checkAuthAndRole = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const user = await getCurrentUserWithRole();

      if (!user) {
        // Not authenticated
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
          user: null,
        });

        // Only redirect to login if not already on login page
        if (pathname !== "/super-admin/login") {
          router.push("/super-admin/login");
        }
        return;
      }

      const isAdmin = true;

      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        isAdmin,
        user,
      });

      if (isAdmin) {
        if (pathname === "/super-admin/login") {
          router.push("/super-admin/dashboard");
        }
      } else {
        if (pathname.startsWith("/super-admin/dashboard")) {
          router.push("/super-admin/login");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
        user: null,
      });

      if (pathname !== "/super-admin/login") {
        router.push("/super-admin/login");
      }
    }
  };

  useEffect(() => {
    checkAuthAndRole();
  }, [pathname]);
  return (
    <SuperAdminAuthContext.Provider value={authState}>
      {children}
    </SuperAdminAuthContext.Provider>
  );
};

export default SuperAdminAuthProvider;
