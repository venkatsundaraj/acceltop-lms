import AdminAuthForm from "@/app/_components/admin/admin-auth-form";
import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page = async ({}: pageProps) => {
  // const session = await getCurrentUser();

  // console.log("session", session);

  // if (session && session.user.userRole === "admin") {
  //   redirect("/super-admin/dashboard");
  // }
  return (
    <section className="w-full bg-background h-screen max-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="md:h-full shadow-md flex items-center justify-center">
        <img
          src={"/marketing/acceltop-logo.webp"}
          className="w-40 fill-foreground stroke-foreground"
        />
      </div>

      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center min-w-sm gap-3">
            <h1 className="text-primary text-secondary-heading leading-normal tracking-normal font-heading font-semibold">
              Login
            </h1>
            <AdminAuthForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
