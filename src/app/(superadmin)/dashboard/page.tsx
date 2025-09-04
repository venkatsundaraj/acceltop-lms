import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <section className="w-full bg-background h-screen max-h-screen flex items-center justify-center">
      <h1 className="text-primary text-7xl leading-normal tracking-normal font-heading font-semibold">
        Dashboard
      </h1>
    </section>
  );
};

export default page;
