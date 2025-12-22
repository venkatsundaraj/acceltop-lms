import TestPracticeTab from "@/app/_components/org-user/modules/qbank/test-practice-tab";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <section className="w-full flex items-center justify-center flex-col gap-8">
      <h1 className="text-primary font-bold text-secondary-heading text-center w-full leading-normal tracking-normal">
        Q-Bank
      </h1>
      <TestPracticeTab />
    </section>
  );
};

export default page;
