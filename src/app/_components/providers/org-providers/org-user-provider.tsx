"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
// import { OrgUserSchema } from "@/server/db/organisation";
import { api } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export type OrgUserContextSchema = {
  //   org: OrgUserSchema | null;
  isPending: boolean;
  //   refetch: () => {};
};

const OrgUserContext = createContext<OrgUserContextSchema | null>(null);

export const OrgUserContextProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const { data: orgUser, isPending, refetch } = api.orgUser.getOrgUser.useQuery();

  const value: OrgUserContextSchema = {
    // orgUser: orgUser ?? null,
    isPending: false,
    // refetch,
  };
  return (
    <OrgUserContext.Provider value={value}>{children}</OrgUserContext.Provider>
  );
};

export const useOrgUserContextProvider = function () {
  const context = useContext(OrgUserContext);
  if (!context) {
    throw new Error("It has to be wrapped");
  }

  return context;
};
