"use client";
import { FC, useEffect } from "react";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { Icons } from "@/app/_components/miscellaneous/lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { authClient, signIn, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface AuthFormProps {}

const AuthForm: FC<AuthFormProps> = ({}) => {
  const router = useRouter();

  const checkIfLoggedIn = async () => {
    const { data } = await authClient.getSession();
    return !!data?.session.id;
  };

  useEffect(() => {
    checkIfLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        router.push("/super-admin/dashboard");
      }
    });
  }, []);
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

export default AuthForm;
