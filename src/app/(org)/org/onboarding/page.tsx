import SignoutButton from "@/app/_components/admin/signout-button";
import OnboardingModal from "@/app/_components/orgs/onboarding-modal";
import OrgSignoutButton from "@/app/_components/orgs/org-sign-out-button";
import { handleTRPCCall } from "@/lib/handle-trpc-error";
import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page = async ({}: pageProps) => {
  const user = await getCurrentUser();

  if (!user || !user.user || !user.user.email || !user.user.name) {
    notFound();
  }
  const result = await handleTRPCCall(() => api.org.getOrg());

  if (result.error) {
    if (result.error.needsRedirect) {
      redirect(result.error.needsRedirect);
    }
  }
  if (result.data?.organizationId) {
    const [org] = await api.org.findOrgById(result.data.organizationId);
    if (org) {
      redirect(`/org/${org.slug}/dashboard`);
    }
  }
  return (
    <section className="flex items-center justify-center bg-primary w-full py-24 min-h-screen relative">
      <div className="container flex items-center justify-center">
        {!result.data?.organizationId ? (
          <OnboardingModal email={user.user.email} name={user.user.name} />
        ) : null}
      </div>
    </section>
  );
};

export default page;
