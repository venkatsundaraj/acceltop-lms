"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { OrgSchema } from "@/server/db/organisation";
import { api } from "@/trpc/react";
import { useSession } from "@/lib/auth-client";
import { useParams } from "next/navigation";
import { Icons } from "../../miscellaneous/lucide-react";

export type OrgContextSchema = {
  org: OrgSchema;
  sessionUser: { id: string | null; role: string | null };
};

interface OrgContextProviderProps {
  children: React.ReactNode;
}

const OrgContext = createContext<OrgContextSchema | null>(null);

export const OrgContextProvider = function ({
  children,
}: OrgContextProviderProps) {
  const { data: sessionData } = useSession();
  const { orgname } = useParams<{ orgname: string }>();

  const {
    data: result,
    isLoading,
    error,
  } = api.org.getOrgBySlug.useQuery({
    orgSlug: orgname,
  });

  if (isLoading) {
    return (
      <section className="w-screen h-screen flex items-center justify-center">
        <Icons.Loader2 className="w-16 animate-spin duration-200" />
      </section>
    );
  }
  if (error || !result?.uniqueOrg) {
    return (
      <section className="w-screen h-screen flex items-center justify-center">
        <h2>Somthing went wrong</h2>
      </section>
    );
  }

  const value = {
    org: result.uniqueOrg,
    sessionUser: {
      id: sessionData?.user.id ?? null,
      role: sessionData?.user.userRole ?? null,
    },
  };

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export const useOrgContext = function () {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("It has to be wrapped");
  }

  return context;
};
