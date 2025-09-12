import SignoutButton from "@/app/_components/admin/signout-button";
import OnboardingModal from "@/app/_components/orgs/onboarding-modal";
import OrgSignoutButton from "@/app/_components/orgs/org-sign-out-button";
import { handleTRPCCall } from "@/lib/handle-trpc-error";
import { getCurrentUser } from "@/lib/session";
import { api, HydrateClient } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page = async ({}: pageProps) => {
  const session = await getCurrentUser();

  if (!session || !session.user || !session.user.email || !session.user.name) {
    return notFound();
  }
  const result = await handleTRPCCall(() => api.org.getOrg());

  if (result.error) {
    if (result.error.needsRedirect) {
      redirect(result.error.needsRedirect);
    }
  }

  if (result.data?.id) {
    redirect(`/org/${result.data.slug}/app`);
  }
  return (
    <HydrateClient>
      <section className="flex items-center justify-center bg-primary w-full py-24 min-h-screen relative">
        <div className="container flex flex-col items-center justify-center py-12">
          <header className="w-full flex items-center justify-end mt-12">
            <OrgSignoutButton className="bg-background text-primary hover:bg-background/70 hover:text-primary" />
          </header>
          {!result.data?.id ? (
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
