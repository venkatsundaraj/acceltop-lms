import { getCurrentUser } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { api } from "@/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: Promise<{ category: string; orgname: string }>;
}

const page = async ({ params }: pageProps) => {
  const { category, orgname } = await params;

  const session = await getCurrentUser();

  if (!session?.user.organizationId) {
    notFound();
  }

  const [subCategoryList, qBankList] = await Promise.all([
    await api.orgQBank.getAllSubcategoriesFromCategorySlugAndOrgSlug({
      categorySlug: category,
      orgSlug: orgname,
      orgId: session.user.organizationId,
    }),
    await api.orgQBank.getAllQBankTitle({
      categorySlug: category,
      orgSlug: orgname,
      orgId: session.user.organizationId,
    }),
  ]);

  return (
    <main className="w-full">
      <section className="grid grid-cols-1 md:grid-cols-4 items-start justify-center gap-12 mt-12">
        <div className="md:col-start-1 md:col-end-4 w-full  ">
          <ul className="container grid grid-cols-1 gap-4 md:grid-cols-2  justify-center">
            {qBankList?.map((item, i) => (
              <Link
                key={i}
                href={`/org/${orgname}/q-bank/${category}/${item.id}`}
              >
                <li className="bg-accent hover:bg-accent/90 p-2 cursor-pointer text-primary w-full flex items-start justify-left text-subtitle-heading font-normal leading-normal tracking-tight rounded-sm">
                  {item.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <div className="container">
            <ul className="flex w-full flex-col items-start justify-start border-l-2 border-l-primary bg-primary gap-1 min-h-[380px] py-4 rounded-sm">
              {subCategoryList?.map((item, i) => (
                <Link key={i} href={`/`}>
                  <li className="bg-transparent cursor-pointer text-background font-heading font-semibold w-full flex items-center justify-center text-[16px] px-4 leading-normal tracking-tight rounded-md ">
                    {item.subCategoryName}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
