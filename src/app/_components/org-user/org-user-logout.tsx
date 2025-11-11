"use client";
import { FC } from "react";
import { Button, buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface OrgUserLogoutProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  className?: string;
  size?: "default" | "sm" | "lg" | "xl" | "icon" | null | undefined;
}

const OrgUserLogout: FC<OrgUserLogoutProps> = ({
  variant,
  className,
  size,
}) => {
  const router = useRouter();
  const { orgname } = useParams<{ orgname: string }>();
  return (
    <Button
      className={cn(
        buttonVariants({ variant: variant, size: size }),
        "cursor-pointer text-[16px]",
        className
      )}
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push(`/org/${orgname}`); // Redirect to the login page
            },
          },
        });
      }}
    >
      Student SignOut
    </Button>
  );
};

export default OrgUserLogout;
