"use client";
import { FC, useEffect } from "react";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { Icons } from "@/app/_components/miscellaneous/lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { authClient, signIn, useSession } from "@/lib/auth-client";
import { notFound, useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";

interface OrgUserLoginProps {}

const OrgUserLogin: FC<OrgUserLoginProps> = ({}) => {
  const params = useParams<{ orgname: string }>();

  const { orgname } = params;
  const { data } = api.org.getOrg.useQuery();
  if (data?.status === "active") notFound();

  const loginHandler = async function () {
    const { data } = await signIn.social({
      provider: "google",
      callbackURL: `/org/${orgname}/org-user`,
    });
    console.log("clicked data", data);
  };
  return (
    <Button
      aria-label="Sign in with Google"
      onClick={loginHandler}
      className={cn(
        buttonVariants({ variant: "default" }),
        "gap-3 cursor-pointer text-[16px]"
      )}
    >
      <span className="text-[16px] font-normal text-background tracking-normal font-paragraph leading-normal">
        Student Login
      </span>
    </Button>
  );
};

export default OrgUserLogin;
