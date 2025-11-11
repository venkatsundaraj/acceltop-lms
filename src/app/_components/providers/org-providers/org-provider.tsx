"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { OrgSchema } from "@/server/db/organisation";
import { api } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export type OrgContextSchema = {
  org: OrgSchema | null;
  isPending: boolean;
  refetch: () => {};
};

const OrgContext = createContext<OrgContextSchema | null>(null);

export const OrgContextProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: org, isPending, refetch } = api.org.getOrg.useQuery();

  const value: OrgContextSchema = {
    org: org ?? null,
    isPending: isPending,
    refetch,
  };
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export const useOrgContextProvider = function () {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("It has to be wrapped");
  }

  return context;
};
