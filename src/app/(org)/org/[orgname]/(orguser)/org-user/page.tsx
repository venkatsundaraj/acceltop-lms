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
  return <main className="w-full">{<h1>hello world</h1>}</main>;
};

export default page;
