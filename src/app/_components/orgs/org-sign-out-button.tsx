"use client";
import { FC } from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface OrgSignoutButtonProps {}

const OrgSignoutButton: FC<OrgSignoutButtonProps> = ({}) => {
  const router = useRouter();
  return (
    <Button
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
