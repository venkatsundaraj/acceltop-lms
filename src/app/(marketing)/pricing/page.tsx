import { buttonVariants } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import { api, HydrateClient } from "@/trpc/server";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <section className="flex flex-col items-center justify-center  py-24 min-h-screen relative">
      <div className="container flex flex-col items-center justify-center gap-16 md:gap-24">
        <h1 className="text-primary text-primary-heading leading-normal tracking-normal font-heading font-bold mt-24">
          Find the Perfect Plan for Your Prep Journey.
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center w-full gap-6">
          <div className="flex flex-col items-start justify-between rounded-sm shadow-xl px-4 py-8 gap-6 min-h-[300px] md:min-h-[580px]">
            <div className="flex flex-col items-start justify-between gap-6">
              <div className="flex flex-col items-start justify-center gap-2">
                <p className="text-foreground/50 text-subtitle-heading leading-normal tracking-normal font-paragraph font-bold">
                  Basic
                </p>
                <h3 className="text-primary text-tertiary-heading leading-normal tracking-normal font-heading font-bold">
                  499 / mo
                </h3>
              </div>
              <div className="flex flex-col items-start justify-center gap-3">
                <p className="text-foreground/50 text-subtitle-heading leading-normal tracking-normal font-paragraph font-bold">
                  What is included
                </p>
                <ul className="flex flex-col items-start justify-center gap-2.5">
                  <li className="flex flex-col items-start text-foreground/50 text-[16px] leading-normal tracking-normal font-paragraph font-normal">
                    QBank X
                    <span>11,000+ MCQs with Audio QBank & Image Bank.</span>
                  </li>
                  <li className="flex flex-col items-start text-foreground/50 text-[16px] leading-normal tracking-normal font-paragraph font-normal">
                    Test Series
                    <span>112 Mock Tests with 1 Lakh participants</span>
                  </li>
                  <li className="flex flex-col items-start text-foreground/50 text-[16px] leading-normal tracking-normal font-paragraph font-normal">
                    Treasures
                    <span>2000+ summary charts for quick revision</span>
                  </li>
                </ul>
              </div>
            </div>
            <Link
              href={"/login"}
              className={cn(
                buttonVariants({ variant: "default", size: "xl" }),
                "w-full self-end"
              )}
            >
              Enroll Now
            </Link>
          </div>
          <div className="flex flex-col items-start justify-between rounded-sm shadow-xl px-4 py-8 gap-6 min-h-[300px] md:min-h-[580px]">
            <div className="flex flex-col items-start justify-between gap-6">
              <div className="flex flex-col items-start justify-center gap-2">
                <p className="text-foreground/50 text-subtitle-heading leading-normal tracking-normal font-paragraph font-bold">
                  Professional
                </p>
                <h3 className="text-primary text-tertiary-heading leading-normal tracking-normal font-heading font-bold">
                  999 / mo
                </h3>
              </div>
              <div className="flex flex-col items-start justify-center gap-3">
                <p className="text-foreground/50 text-subtitle-heading leading-normal tracking-normal font-paragraph font-bold">
                  What is included
                </p>
                <ul className="flex flex-col items-start justify-center gap-2.5">
                  <li className="flex flex-col items-start text-foreground/50 text-[16px] leading-normal tracking-normal font-paragraph font-normal">
                    QBank X
                    <span>11,000+ MCQs with Audio QBank & Image Bank.</span>
                  </li>
                  <li className="flex flex-col items-start text-foreground/50 text-[16px] leading-normal tracking-normal font-paragraph font-normal">
                    Test Series
                    <span>112 Mock Tests with 1 Lakh participants</span>
                  </li>
                  <li className="flex flex-col items-start text-foreground/50 text-[16px] leading-normal tracking-normal font-paragraph font-normal">
                    Treasures
                    <span>2000+ summary charts for quick revision</span>
                  </li>
                  <li className="flex flex-col items-start text-foreground/50 text-[16px] leading-normal tracking-normal font-paragraph font-normal">
                    Rapid Revision & LRR
                    <span>Covering all high-yield topics for revision</span>
                  </li>
                  <li className="flex flex-col items-start text-foreground/50 text-[16px] leading-normal tracking-normal font-paragraph font-normal">
                    Treasures
                    <span>2000+ summary charts for quick revision</span>
                  </li>
                </ul>
              </div>
            </div>
            <Link
              href={"/login"}
              className={cn(
                buttonVariants({ variant: "default", size: "xl" }),
                "w-full self-end"
              )}
            >
              Enroll Now
            </Link>
          </div>
          <div className="flex flex-col items-start justify-between rounded-sm shadow-xl px-4 py-8 gap-6 min-h-[300px] md:min-h-[580px]">
            <div className="flex flex-col items-start justify-between gap-6">
              <div className="flex flex-col items-start justify-center gap-2">
                <p className="text-foreground/50 text-subtitle-heading leading-normal tracking-normal font-paragraph font-bold">
                  Enterprise
                </p>
                <h3 className="text-primary text-tertiary-heading leading-normal tracking-normal font-heading font-bold">
                  1499 / mo
                </h3>
              </div>
              <div className="flex flex-col items-start justify-center gap-3">
                <p className="text-foreground/50 text-subtitle-heading leading-normal tracking-normal font-paragraph font-bold">
                  What is included
                </p>
                <ul className="flex flex-col items-start justify-center gap-2.5">
                  <li className="flex flex-col items-start text-foreground/50 text-[16px] leading-normal tracking-normal font-paragraph font-normal">
                    Targeted resources
                    <span>
                      Access videos, QBank, notes, etc, tailored for your prep.
                    </span>
                  </li>
                  <li className="flex flex-col items-start text-foreground/50 text-[16px] leading-normal tracking-normal font-paragraph font-normal">
                    Select from expertly crafted plans
                    <span>Choose the plan that suits for prep needs.</span>
                  </li>
                </ul>
              </div>
            </div>
            <Link
              href={"/login"}
              className={cn(
                buttonVariants({ variant: "default", size: "xl" }),
                "w-full self-end"
              )}
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
