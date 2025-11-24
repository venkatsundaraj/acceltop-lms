"use client";

import { useSession } from "@/lib/auth-client";
import { OrgUserSchema } from "@/server/db/organisation-user";
import { api } from "@/trpc/react";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type OrgUserContextSchema = {
  orgUser: OrgUserSchema | null;
  sessionUser: { id: string | null; role: string | null; name: string | null };
};

export type OrgUserProviderProps = {
  children: React.ReactNode;
};

const OrgUserContext = createContext<OrgUserContextSchema | null>(null);

export const OrgUserContextProvider = function ({
  children,
}: OrgUserProviderProps) {
  const { data } = useSession();
  const { data: result } = api.orgUser.getOrgUser.useQuery();
  const value = {
    orgUser: result ?? null,
    sessionUser: {
      id: data?.user.id ?? null,
      role: data?.user.userRole ?? null,
      name: data?.user.name ?? null,
    },
  };

  return (
    <OrgUserContext.Provider value={value}>{children}</OrgUserContext.Provider>
  );
};

export const useOrgUserContext = function () {
  const context = useContext(OrgUserContext);
  if (!context) {
    throw new Error("It has to be wrapped");
  }

  return context;
};
