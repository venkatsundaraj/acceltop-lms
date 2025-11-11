import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    orgname: string;
  };
}

const page = async ({ params }: pageProps) => {
  const { orgname } = await params;
  const session = await getCurrentUser();
  const orgUser = await api.orgUser.getOrgUser();

  if (!session || !session.user.id) {
    notFound();
  }
  const { uniqueOrg } = await api.org.getOrgBySlug({ orgSlug: orgname });

  if (!uniqueOrg) {
    notFound();
  }

  const user = await api.org.getOrg();

  if (user?.status === "active") {
    await auth.api.signOut({
      headers: await headers(),
    });
    notFound();
  }
  if (!orgUser?.organisationId) {
    const user = await api.orgUser.createOrgUser({ orgId: uniqueOrg.id });
  }

  return <main className="w-full">{<h1>hello world</h1>}</main>;
};

export default page;
