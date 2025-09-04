import AuthForm from "@/app/_components/admin/auth-form";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <section className="w-full bg-background h-screen max-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="md:h-full shadow-md" />

      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center min-w-sm gap-3">
            <h1 className="text-primary text-secondary-heading leading-normal tracking-normal font-heading font-semibold">
              Login
            </h1>
            <AuthForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
