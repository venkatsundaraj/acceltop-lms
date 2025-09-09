"use client";
import { FC } from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface SignoutButtonProps {}

const SignoutButton: FC<SignoutButtonProps> = ({}) => {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/super-admin/login"); // Redirect to the login page
            },
          },
        });
      }}
    >
      SignOut
    </Button>
  );
};

export default SignoutButton;
