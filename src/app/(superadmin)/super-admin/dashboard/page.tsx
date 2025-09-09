import { auth } from "@/lib/auth";
import { useSession } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface pageProps {}

const page = async ({}) => {
  const session = await getCurrentUser();

  console.log(
    "session",
    session,
    session?.user,
    session && session.user.userRole !== "admin",
    !!session
  );

  if (!session || session.user.userRole !== "admin") {
    redirect("/super-admin/login");
  }
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <section className="w-full bg-background h-screen max-h-screen flex items-center justify-center">
        <h1 className="text-primary text-7xl leading-normal tracking-normal font-heading font-semibold">
          Dashboard
        </h1>
      </section>
    </Suspense>
  );
};

export default page;
