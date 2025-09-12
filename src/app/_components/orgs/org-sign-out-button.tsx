"use client";
import { FC } from "react";
import { Button, buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface OrgSignoutButtonProps {
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

const OrgSignoutButton: FC<OrgSignoutButtonProps> = ({
  variant,
  className,
  size,
}) => {
  const router = useRouter();
  return (
    <Button
      className={cn(
        buttonVariants({ variant: variant, size: size }),
        "cursor-pointer",
        className
      )}
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/org/login"); // Redirect to the login page
            },
          },
        });
      }}
    >
      SignOut
    </Button>
  );
};

export default OrgSignoutButton;
