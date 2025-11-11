import SignoutButton from "@/app/_components/admin/signout-button";
import OnboardingModal from "@/app/_components/orgs/onboarding-modal";
import OrgSignoutButton from "@/app/_components/orgs/org-sign-out-button";
import { auth } from "@/lib/auth";
import { handleTRPCCall } from "@/lib/handle-trpc-error";
import { getCurrentUser } from "@/lib/session";
import { api, HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page = async ({}: pageProps) => {
  const session = await getCurrentUser();

  if (
    !session ||
    !session.user ||
    !session.user.email ||
    !session.user.name ||
    session.user.userRole !== "org"
  ) {
    await auth.api.signOut({
      headers: await headers(),
    });
    return notFound();
  }

  const result = await handleTRPCCall(() => api.org.getOrg());
  // console.log("result", result);

  if (result.error) {
    if (result.error.needsRedirect) {
      redirect(result.error.needsRedirect);
    }
  }

  if (result.data?.id && result.data?.status === "active") {
    redirect(`/org/${result.data.slug}/app`);
  }
  return (
    <HydrateClient>
      <section className="flex items-center justify-center bg-primary w-full py-24 min-h-screen relative">
        <div className="container flex flex-col items-center justify-start py-12">
          <header className="w-full flex items-center justify-end ">
            <OrgSignoutButton className="bg-background text-primary hover:bg-background/70 hover:text-primary" />
          </header>
          {!result.data?.id || result.data?.status === "pending" ? (
            <OnboardingModal
              email={session.user.email}
              name={session.user.name}
            />
          ) : null}
        </div>
      </section>
    </HydrateClient>
  );
};

export default page;
