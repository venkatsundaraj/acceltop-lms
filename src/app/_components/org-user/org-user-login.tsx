"use client";
import { FC, useEffect } from "react";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { Icons } from "@/app/_components/miscellaneous/lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { authClient, signIn, useSession } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";

interface OrgUserLoginProps {}

const OrgUserLogin: FC<OrgUserLoginProps> = ({}) => {
  const params = useParams<{ orgname: string }>();

  const { orgname } = params;

  const loginHandler = async function () {
    const { data } = await signIn.social({
      provider: "google",
      callbackURL: `/org/${orgname}/org-user-dashboard`,
    });
    console.log("clicked data", data);
  };
  return (
    <Button
      aria-label="Sign in with Google"
      onClick={loginHandler}
      className={cn(
        buttonVariants({ variant: "default" }),
        "gap-3 cursor-pointer"
      )}
    >
      <span className="text-subtitle-heading font-normal text-background tracking-normal font-paragraph leading-normal">
        Login
      </span>
    </Button>
  );
};

export default OrgUserLogin;
