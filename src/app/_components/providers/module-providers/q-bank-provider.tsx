"use client";

import { QBankType } from "@/lib/validation/modules";
import { ListOfQuestionsType } from "@/server/db/index-schema";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { createContext, useCallback, useContext, useMemo } from "react";
import { Icons } from "../../miscellaneous/lucide-react";

type Questions = ListOfQuestionsType & { questionType: QBankType };
type QbankType = {
  id: string;
  listOfExistingQuestions: Questions[] | [];
};
export const QbankContext = createContext<QbankType | null>(null);

export const QbankProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  const { qbank: qbankId } = useParams<{ qbank: string }>();

  const {
    data: getAllQestionsFromId,
    isLoading,
    error,
  } = api.orgQBank.fetchAllQuestionsFromId.useQuery({
    id: qbankId,
  });

  const value = useMemo(
    () => ({
      id: qbankId,
      listOfExistingQuestions: getAllQestionsFromId ?? [],
    }),
    [qbankId, getAllQestionsFromId]
  );

  if (isLoading) {
    return (
      <section className="w-screen h-screen flex items-center justify-center">
        <Icons.Loader2 className="w-16 animate-spin duration-200" />
      </section>
    );
  }

  return (
    <QbankContext.Provider value={value ?? null}>
      {children}
    </QbankContext.Provider>
  );
};

export const useQbankProvider = function () {
  const context = useContext(QbankContext);

  if (!context) {
    throw new Error("You should wrap the entire component");
  }

  return context;
};
