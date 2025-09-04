import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface pageProps {}

const page = async ({}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
  return (
    <section className="w-full bg-background h-screen max-h-screen flex items-center justify-center">
      <h1 className="text-primary text-7xl leading-normal tracking-normal font-heading font-semibold">
        Dashboard
      </h1>
    </section>
  );
};

export default page;
