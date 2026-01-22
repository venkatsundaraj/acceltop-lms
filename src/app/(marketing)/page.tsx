import Link from "next/link";

import { api, HydrateClient } from "@/trpc/server";
import { env } from "@/env";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import { howItWorksData, keyValueSection } from "@/config/marketing";
import { Icon, Icons } from "@/app/_components/miscellaneous/lucide-react";
import { reviewsContent } from "@/config/marketing";
import { Marquee } from "@/app/_components/ui/marquee";
import TestimonialCard from "@/app/_components/miscellaneous/testimonial-card";

export const dynamic = "force-dynamic";

const firstRow = reviewsContent.slice(0, reviewsContent.length / 2);
const secondRow = reviewsContent.slice(reviewsContent.length / 2);

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  // console.log(hello);

  return (
    <HydrateClient>
      <section className="flex flex-col items-center justify-center bg-gradient-to-b from-primary/50 to-primary-foreground py-24 min-h-screen relative">
        <div className="container flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3 md:gap-6">
            <h1 className="text-primary text-5xl md:text-5xl xl:text-7xl leading-[0.9] text-center tracking-tight font-heading font-bold max-w-2xl ">
              Own the Future of Learning
            </h1>
            <p className="text-foreground/50 text-paragraph-heading text-center leading-tight tracking-normal font-paragraph font-normal max-w-2xl ">
              Personalized pathways, adaptive assessments, and immersive
              collaboration—all in your branded LMS
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href={"/org/login"}
                className={cn(
                  buttonVariants({ variant: "default", size: "xl" }),
                )}
              >
                Get Started
              </Link>
              <Link
                href={"/pricing"}
                className={cn(
                  buttonVariants({ variant: "outline", size: "xl" }),
                )}
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center bg-background py-24 min-h-screen relative">
        <div className="container flex flex-col items-start justify-center gap-16">
          <h2 className="text-secondary text-primary-heading leading-normal tracking-normal font-heading font-bold">
            Key Value Props
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 items-center justify-center w-full  gap-6">
            {keyValueSection.length
              ? keyValueSection.map((item, i) => {
                  const ValueIcon = Icons[item.icon as Icon];
                  return (
                    <li
                      className="flex items-start flex-col justify-center gap-3 rounded-sm shadow-md p-4 md:p-8 bg-primary/10 h-full hover:bg-primary/5 transition-colors duration-200"
                      key={i}
                    >
                      <ValueIcon className="w-24 h-24 fill-foreground/40" />
                      <h4 className="text-secondary text-tertiary-heading leading-normal tracking-tight font-heading font-semibold ">
                        {item.title}
                      </h4>
                      <p className="text-foreground/50 text-subtitle-heading leading-normal tracking-normal font-paragraph font-normal ">
                        {item.description}
                      </p>
                      <Link
                        href={"/pricing"}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "text-secondary border-secondary hover:text-secondary hover:border-secondary",
                        )}
                      >
                        Learn More
                      </Link>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center bg-primary py-24">
        <div className="container flex flex-col items-start justify-center gap-16">
          <h2 className="text-background text-primary-heading leading-normal tracking-normal font-heading font-bold">
            How It Works
          </h2>
          <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center w-full">
              {Array.from({ length: 3 }).map((item, i) => (
                <div
                  key={i}
                  className="w-full flex items-center justify-center"
                >
                  <div className="rounded-full w-24 h-24 flex items-center justify-center bg-background">
                    <span className="text-primary text-tertiary-heading leading-normal tracking-tight font-heading font-semibold ">
                      {i + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 items-start justify-center w-full">
              {Array.from(howItWorksData).map((item, i) => (
                <div
                  key={i}
                  className="w-full flex gap-3 flex-col items-center justify-start"
                >
                  <h4 className="text-background text-tertiary-heading leading-normal text-center tracking-tight font-heading font-semibold ">
                    {item.title}
                  </h4>
                  <p className="text-background max-w-sm text-subtitle-heading text-center leading-tight tracking-normal font-paragraph font-normal ">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center bg-background py-24">
        <div className="container flex flex-col items-start justify-center gap-16">
          <h2 className="text-secondary text-primary-heading leading-normal tracking-normal font-heading font-bold">
            Testimonials
          </h2>
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:20s]">
              {firstRow.map((review) => (
                <TestimonialCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
              {secondRow.map((review) => (
                <TestimonialCard key={review.username} {...review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
          </div>
        </div>
      </section>
    </HydrateClient>
  );
}
