import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface layoutProps {
  params: {
    orgname: string;
  };
  children: React.ReactNode;
}

const layout = async ({ params, children }: layoutProps) => {
  const { orgname } = await params;
  const session = await getCurrentUser();
  // const orgUser = await api.orgUser.getOrgUser();

  if (!session || !session.user.id) {
    notFound();
  }
  const { uniqueOrg } = await api.org.getOrgBySlug({ orgSlug: orgname });

  if (!uniqueOrg) {
    notFound();
  }

  const user = await api.org.getOrg();
  const orgUser = await api.orgUser.getOrgUserFromOrgId({
    orgId: uniqueOrg.id,
  });

  // what if the org user comes here - (it would always be active, right, so it won't be a problem)
  if (user?.status === "active") {
    await auth.api.signOut({
      headers: await headers(),
    });
    notFound();
  }
  if (!orgUser) {
    const user = await api.orgUser.createOrgUser({ orgId: uniqueOrg.id });
  }

  return <main className="w-full">{<h1>{children}</h1>}</main>;
};

export default layout;
