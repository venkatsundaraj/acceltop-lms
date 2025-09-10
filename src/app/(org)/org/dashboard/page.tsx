import SignoutButton from "@/app/_components/admin/signout-button";
import OrgSignoutButton from "@/app/_components/orgs/org-sign-out-button";
import { env } from "@/env";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface pageProps {}

const page = async ({}) => {
  const user = await getCurrentUser();

  if (
    !user ||
    !user.session ||
    !user.user.email ||
    env.ADMIN_EMAIL.includes(user.user.email)
  ) {
    redirect("/org/login");
  }

  return (
    <section className="w-full bg-background h-screen max-h-screen flex items-center justify-center">
      <h1 className="text-primary text-7xl leading-normal tracking-normal font-heading font-semibold">
        Dashboard
      </h1>
      <OrgSignoutButton />
    </section>
  );
};

export default page;
