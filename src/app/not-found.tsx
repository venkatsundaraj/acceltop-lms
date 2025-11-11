import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./_components/ui/button";

export default function NotFound() {
  return (
    <main className="w-screen h-screen flex flex-col items-center gap-5 justify-center">
      <h2 className="text-primary text-5xl md:text-5xl xl:text-7xl leading-[0.9] text-center tracking-tight font-heading font-bold max-w-2xl ">
        Not Found
      </h2>
      <p className="text-foreground/50 text-paragraph-heading text-center leading-tight tracking-normal font-paragraph font-normal max-w-2xl ">
        Could not find requested resource
      </p>
      <Link className={cn(buttonVariants({ variant: "outline" }))} href="/">
        Return Home
      </Link>
    </main>
  );
}
