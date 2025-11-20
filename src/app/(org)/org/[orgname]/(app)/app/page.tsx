import OrgSignoutButton from "@/app/_components/orgs/org-sign-out-button";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-secondary-heading">
      Welcome to your organisation
    </div>
  );
};

export default page;
