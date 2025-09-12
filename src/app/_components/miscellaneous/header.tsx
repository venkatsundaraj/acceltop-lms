import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { buttonVariants } from "@/app/_components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { api } from "@/trpc/server";
import * as schema from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { handleTRPCCall } from "@/lib/handle-trpc-error";

interface HeaderProps {}

const Header = async ({}: HeaderProps) => {
  const result = await handleTRPCCall(() => api.org.getOrg());

  if (!result.data || !result.data.id || result.error) {
    console.log(result.error);
  }

  // const org = await db.select().from(schema.organisation).where(eq(schema.organisation.id, session?.user.organizationId!))

  return (
    <header
      className={cn(
        "flex flex-row items-center justify-center gap-0 z-20  absolute top-0 w-screen  px-6 xl:px-14 py-6 ",
        true && "justify-center"
      )}
    >
      <div className=" container flex items-center justify-between">
        <Link href={"/"}>
          <img
            src={"/marketing/acceltop-logo.webp"}
            className="w-36 fill-foreground stroke-foreground"
          />
        </Link>
        <nav className="flex items-center justify-center gap-3">
          <ul className="flex items-center justify-center gap-6">
            <li className="text-primary text-subtitle-heading leading-normal tracking-normal font-paragraph font-normal ">
              <Link href={"/pricing"}>Pricing</Link>
            </li>
            <li className="text-background text-subtitle-heading leading-normal tracking-normal font-paragraph font-normal ">
              {result.data?.id ? (
                <Link
                  href={`/org/${result.data.slug}/app`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" })
                  )}
                >
                  Home
                </Link>
              ) : (
                <Link
                  href={"/org/login"}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" })
                  )}
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
