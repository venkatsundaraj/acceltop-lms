"use client";
import { FC, useEffect } from "react";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { Icons } from "@/app/_components/miscellaneous/lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { authClient, signIn, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { getCurrentUser } from "@/lib/session";

interface AdminAuthFormProps {}

const AdminAuthForm: FC<AdminAuthFormProps> = ({}) => {
  const loginHandler = async function () {
    const { data } = await signIn.social({
      provider: "google",
      callbackURL: "/super-admin/dashboard",
    });
    console.log("clicked data", data);
  };

  return (
    <Button
      aria-label="Sign in with Google"
      onClick={loginHandler}
      className={cn(
        buttonVariants({ variant: "default" }),
        "w-full gap-3 cursor-pointer"
      )}
    >
      <Icons.Google className="fill-foreground stroke-foreground cursor-pointer" />
      <span className="text-subtitle-heading font-normal text-background tracking-normal font-paragraph leading-normal">
        Sign in with Google
      </span>
    </Button>
  );
};

export default AdminAuthForm;
