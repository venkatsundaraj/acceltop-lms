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

interface OrgAuthProviderProps {
  children: React.ReactNode;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isOrg: boolean;
  user: any | null;
}

const OrgAuthContext = createContext<AuthState | null>(null);

export const useSuperAdminAuth = () => {
  const context = useContext(OrgAuthContext);
  if (!context) {
    throw new Error("useSuperAdminAuth must be used within OrgAuthProvider");
  }
  return context;
};

const OrgAuthProvider: FC<OrgAuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    isOrg: false,
    user: null,
  });

  const getCurrentUserWithRole = async () => {
    try {
      const { data } = await authClient.getSession();

      const user = await data?.user;

      if (!user || !user.id) {
        return null;
      }

      return user;
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
          isOrg: false,
          user: null,
        });

        return;
      }

      const isOrg = user.userRole === "org";

      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        isOrg,
        user,
      });

      if (isOrg) {
        if (pathname === "/org/login") {
          router.push("/org/dashboard");
        }
      } else {
        if (pathname.startsWith("/org/dashboard")) {
          router.push("/org/login");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        isOrg: false,
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
    <OrgAuthContext.Provider value={authState}>
      {children}
    </OrgAuthContext.Provider>
  );
};

export default OrgAuthProvider;
