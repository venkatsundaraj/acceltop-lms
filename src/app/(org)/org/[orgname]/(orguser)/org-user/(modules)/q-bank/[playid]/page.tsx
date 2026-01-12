"use client";

import { useQbankProvider } from "@/app/_components/providers/module-providers/q-bank-provider";
import { useUserQBankContext } from "@/app/_components/providers/org-user-providers/modules/q-bank-provider";
import { FC, useEffect } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { questions } = useUserQBankContext();
  useEffect(() => {
    console.log(questions);
  }, [questions]);
  return (
    <div>
      {questions.map((item, i) => (
        <p key={i}>{item.questionText}</p>
      ))}
    </div>
  );
};

export default page;
