"use client";

import { useParams } from "next/navigation";
import { createContext, useContext, useMemo } from "react";

type QbankType = {
  id: string;
};
export const QbankContext = createContext<QbankType | null>(null);

export const QbankProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  const { qbank: qbankId } = useParams<{ qbank: string }>();

  const value = useMemo(() => ({ id: qbankId }), [qbankId]);
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
