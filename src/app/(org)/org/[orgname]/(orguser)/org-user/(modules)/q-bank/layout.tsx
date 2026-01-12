import { UserQBankProvider } from "@/app/_components/providers/org-user-providers/modules/q-bank-provider";
import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return <UserQBankProvider>{children}</UserQBankProvider>;
};

export default layout;
