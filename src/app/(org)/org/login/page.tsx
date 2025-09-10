import OrgAuthForm from "@/app/_components/orgs/org-auth-form";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { env } from "@/env";

import { FC } from "react";

interface pageProps {}

const page = async ({}: pageProps) => {
  const user = await getCurrentUser();

  if (
    user &&
    user.session &&
    user.user.email &&
    env.ADMIN_EMAIL.includes(user.user.email)
  ) {
    redirect("/super-admin/dashboard");
  }

  if (
    user &&
    user.session &&
    user.user.email &&
    !env.ADMIN_EMAIL.includes(user.user.email)
  ) {
    redirect("/org/dashboard");
  }

  return (
    <section className="w-full bg-background h-screen max-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="md:h-full shadow-md flex items-center justify-center">
        <img
          src={"/marketing/acceltop-logo.webp"}
          className="w-40 fill-foreground stroke-foreground"
        />
      </div>

      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center min-w-sm gap-3">
            <h1 className="text-primary text-secondary-heading leading-normal tracking-normal font-heading font-semibold">
              Login
            </h1>
            <OrgAuthForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
