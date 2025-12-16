import AddQuestions from "@/app/_components/orgs/modules/q-bank/add-questions";
import { FC } from "react";

interface pageProps {
  params: Promise<{ category: string; orgname: string; qbank: string }>;
}

const page = async ({ params }: pageProps) => {
  const { ...all } = await params;

  return <AddQuestions />;
};

export default page;

{
  /* <AddQuestions />; */
}
