"use client";

import { StatusOfTheQuestionsBank } from "@/lib/validation/category-user/qbank";
import { api } from "@/trpc/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useOrgContext } from "@/app/_components/providers/org-providers/org-provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ListOfQuestionsType } from "@/server/db/index-schema";

type QuestionResponse = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent: number;
  answeredAt: Date;
};
type UserQBankType = {
  startTest: (
    numberOfQuestions: number,
    categoryIds: string[],
    subCategoryIds: string[],
    status: StatusOfTheQuestionsBank
  ) => void;
  questions: ListOfQuestionsType[];
  testAttemptId: string | null;
  currentQuestionIndex: number;
  isTestActive: boolean;
  testStartTime: Date | null;
  questionsStartTime: Date | null;
  response: QuestionResponse[];
};

const UserQBankContext = createContext<UserQBankType | null>(null);

export const UserQBankProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  const [testAttemptId, setTestAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ListOfQuestionsType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [testStartTime, setteStStartTime] = useState<Date | null>(null);
  const [response, setResponse] = useState<QuestionResponse[]>([]);
  const [questionsStartTime, setQuestionsStartTime] = useState<Date | null>(
    null
  );

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
      if (!res || !res.testAttempt || !res.testAttempt.id) {
        toast.error("something went wrong");
        throw new Error("Something went wrong");
      }

      setTestAttemptId(res.testAttempt.id);
      setQuestions(res?.listOfQuestions.length ? res.listOfQuestions : []);
      setCurrentQuestionIndex(0);
      setIsTestActive(true);
      setResponse([]);
      setteStStartTime(new Date());
      setQuestionsStartTime(new Date());

      toast.success("You are redirected to the playground");

      router.push(`/org/${org.slug}/org-user/q-bank/${res?.testAttempt.id}`);
    },
    []
  );

  useEffect(() => {
    console.log(questions);
  }, [questions]);
  const value = useMemo(
    () => ({
      startTest,
      questions,
      testAttemptId,
      currentQuestionIndex,
      isTestActive,
      testStartTime,
      questionsStartTime,
      response,
    }),
    [
      startTest,
      questions,
      testAttemptId,
      currentQuestionIndex,
      isTestActive,
      testStartTime,
      questionsStartTime,
      response,
    ]
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
