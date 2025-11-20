import AddSubCategory from "@/app/_components/orgs/content/add-subcategory";
import { FC } from "react";

interface pageProps {
  params: {
    category: string;
    orgname: string;
  };
}

const page = async ({ params }: pageProps) => {
  const data = await params;

  return (
    <section className="flex w-full py-8 md:py-16 items-center justify-center flex-col gap-8">
      <h2 className="text-primary text-secondary-heading leading-[0.9] text-center tracking-tight font-heading font-bold max-w-2xl ">
        Add Sub Category
      </h2>
      <AddSubCategory />
    </section>
  );
};

export default page;
