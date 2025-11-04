import { authClient } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/server/db";
import { FC } from "react";
import { user as userTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface pageProps {}

const page = async ({}: pageProps) => {
  const session = await getCurrentUser();
  //get the org detail, if they enter here restrict them as an organisation user

  if (!session || !session.user.id) {
    notFound();
  }

  await db
    .update(userTable)
    .set({ userRole: "org_user" })
    .where(eq(userTable.id, session?.user.id));

  return <div>page</div>;
};

export default page;
