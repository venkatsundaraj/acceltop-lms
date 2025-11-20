import { OrgContextProvider } from "@/app/_components/providers/org-providers/org-provider";
import { OrgUserContextProvider } from "./org-user-provider";

interface DashboardProviderProps {
  children: React.ReactNode;
}

const DashboardProvider = async ({ children }: DashboardProviderProps) => {
  return (
    <OrgContextProvider>
      <OrgUserContextProvider>{children}</OrgUserContextProvider>
    </OrgContextProvider>
  );
};

export default DashboardProvider;
