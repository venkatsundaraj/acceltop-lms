"use client";

import { useOrgContext } from "@/app/_components/providers/org-providers/org-provider";
import { api } from "@/trpc/react";
import Link from "next/link";
import { FC } from "react";

interface QBankTitleListProps {}

const QBankTitleList: FC<QBankTitleListProps> = ({}) => {
  const { org } = useOrgContext();
  const { data: categoryList } = api.orgQBank.getAllQbankDetails.useQuery({
    orgId: org.id,
  });
  return (
    <ul className="container py-12 grid grid-cols-1 gap-5 md:grid-cols-4 items-center justify-center">
      {categoryList?.items?.map((item, i) => (
        <Link
          key={item.categoryId}
          href={`/org/${org.slug}/q-bank/${item.categorySlug}`}
        >
          <li className="border-2 border-accent hover:bg-accent/70 cursor-pointer text-primary w-full flex items-center justify-center text-tertiary-heading font-normal leading-normal tracking-tight py-2 rounded-md ">
            {item.categoryName}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default QBankTitleList;
