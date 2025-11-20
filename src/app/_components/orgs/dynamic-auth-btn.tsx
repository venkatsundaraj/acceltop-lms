"use client";

import { FC } from "react";
import { useOrgContext } from "../providers/org-providers/org-provider";
import { useOrgUserContext } from "../providers/org-providers/org-user-provider";
import { useParams } from "next/navigation";
import OrgSignoutButton from "./org-sign-out-button";
import OrgUserLogout from "../org-user/org-user-logout";
import OrgUserLogin from "../org-user/org-user-login";

interface DynamicAuthBtnProps {}

const DynamicAuthBtn: FC<DynamicAuthBtnProps> = ({}) => {
  const { org, sessionUser } = useOrgContext();
  const { orgUser } = useOrgUserContext();
  const { orgname } = useParams<{ orgname: string }>();
  return (
    <>
      {sessionUser && sessionUser.role === "org" && org?.slug === orgname ? (
        <OrgSignoutButton />
      ) : orgUser && sessionUser.role === "org_user" ? (
        <OrgUserLogout />
      ) : (
        <OrgUserLogin />
      )}
    </>
  );
};

export default DynamicAuthBtn;
