import SignoutButton from "@/app/_components/admin/signout-button";
import { auth } from "@/lib/auth";
import { useSession } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 0;

interface pageProps {}

const page = async ({}) => {
  const user = await getCurrentUser();
  if (!user || !user.session) {
    redirect("/super-admin/login");
  }
  return (
    <section className="w-full bg-background h-screen max-h-screen flex items-center justify-center">
      <h1 className="text-primary text-7xl leading-normal tracking-normal font-heading font-semibold">
        Dashboard
      </h1>
      <SignoutButton />
    </section>
  );
};

export default page;
