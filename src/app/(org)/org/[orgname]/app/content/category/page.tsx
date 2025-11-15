import AddCategory from "@/app/_components/orgs/content/add-category";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <section className="flex w-full py-8 md:py-16 items-center justify-center flex-col gap-8">
      <h2 className="text-primary text-secondary-heading leading-[0.9] text-center tracking-tight font-heading font-bold max-w-2xl ">
        Add Category
      </h2>
      <AddCategory />
    </section>
  );
};

export default page;
