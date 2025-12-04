"use client";

import { FC } from "react";

import QBankCategoryList from "@/app/_components/orgs/modules/q-bank/q-bank-category-list";
import AddQuizTitleButton from "@/app/_components/orgs/modules/q-bank/add-quiz-title-button";
import { useOrgContext } from "@/app/_components/providers/org-providers/org-provider";

interface AddQuizTitleFormProps {}

const AddQuizTitleForm: FC<AddQuizTitleFormProps> = ({}) => {
  const { sessionUser } = useOrgContext();
  return (
    <section className="flex items-center justify-center">
      <div className="container flex flex-col items-start justify-center">
        {sessionUser.role === "org" ? <AddQuizTitleButton /> : null}
        <QBankCategoryList />
      </div>
    </section>
  );
};

export default AddQuizTitleForm;
