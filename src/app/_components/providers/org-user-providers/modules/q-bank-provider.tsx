"use client";

import { StatusOfTheQuestionsBank } from "@/lib/validation/category-user/qbank";
import { api } from "@/trpc/react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useOrgContext } from "@/app/_components/providers/org-providers/org-provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type UserQBankType = {
  startTest: (
    numberOfQuestions: number,
    categoryIds: string[],
    subCategoryIds: string[],
    status: StatusOfTheQuestionsBank
  ) => void;
};

const UserQBankContext = createContext<UserQBankType | null>(null);

export const UserQBankProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  const { org } = useOrgContext();
  const router = useRouter();
  const { mutateAsync: createTestAttempt } =
    api.orgUserQBank.createTestAttempt.useMutation({});
  const startTest = useCallback(
    async (
      numberOfQuestions: number,
      categoryIds: string[],
      subCategoryIds: string[],
      status: StatusOfTheQuestionsBank
    ) => {
      const res = await createTestAttempt({
        numberOfQuestions,
        categoryIds,
        subCategoryIds,
        status,
        organisationId: org.id,
      });
      if (!res || !res.id) toast.error("something went wrong");

      toast.success("You are redirected to the playground");

      router.push(`/org/${org.slug}/org-user/q-bank/${res?.id}`);
    },
    []
  );
  const value = useMemo(
    () => ({
      startTest,
    }),
    []
  );

  return (
    <UserQBankContext.Provider value={value}>
      {children}
    </UserQBankContext.Provider>
  );
};

export const useUserQBankContext = function () {
  const context = useContext(UserQBankContext);
  if (!context) {
    throw new Error("The product has to be wrapped around the application");
  }

  return context;
};
