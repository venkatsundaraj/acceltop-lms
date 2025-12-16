"use client";

import { Icons } from "@/app/_components/miscellaneous/lucide-react";
import { useQbankProvider } from "@/app/_components/providers/module-providers/q-bank-provider";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/text-area";
import { QuestionFormData, questionFormSchema } from "@/lib/validation/modules";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useParams } from "next/navigation";
import { FC, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface AddQuestionsProps {}

const AddQuestions: FC<AddQuestionsProps> = () => {
  const { id: qbankId } = useQbankProvider();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { isSubmitting, errors },
    control,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      questions: Array(2)
        .fill(null)
        .map(() => ({
          questionText: "hello-world",
          options: [
            { text: "hello-world", isCorrect: false },
            { text: "hello-world", isCorrect: false },
            { text: "hello-world", isCorrect: true },
            { text: "hello-world", isCorrect: false },
          ],
          explanation: "hello-worldhello-worldhello-worldhello-world",
        })),
    },
  });

  const { mutateAsync: addQuestionData } =
    api.orgQBank.addQuestionsWithExplanations.useMutation({
      onSuccess: (data) => {
        console.log(data);
      },
    });

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control,
  });

  const addQuestion = () => {
    append({
      questionText: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      explanation: "",
    });
  };

  const removeQuestion = (index: number) => {
    if (fields.length > 10) {
      remove(index);
    }
  };

  const submitHandler = async function (data: QuestionFormData) {
    await addQuestionData({
      ...data,
      microTopicdId: null,
      qbankdId: qbankId,
    });
  };

  const toggleCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const currentOptions = watch(`questions.${questionIndex}.options`) || [];
    const updatedOptions = currentOptions.map((opt, i) => ({
      ...opt,
      isCorrect: i === optionIndex,
    }));
    setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  return (
    <section className="flex items-center justify-center flex-col gap-16 w-full">
      <h1 className="text-primary font-heading font-semibold text-secondary-heading leading-normal tracking-normal">
        Please add your list of questions here
      </h1>
      <div className="container flex items-center justify-center flex-col">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex items-center justify-center flex-col gap-8 w-full max-w-4xl"
        >
          {fields.map((field, questionIndex) => (
            <div
              key={field.id}
              className="flex items-center justify-center flex-col gap-8 max-w-4xl w-full py-8 border-b border-ring/60 relative"
            >
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors absolute top-[10px] right-0"
                  title="Remove question"
                >
                  <Icons.Trash2 size={16} />
                </button>
              )}
              <div className="flex flex-col items-start justify-center gap-2 w-full">
                <label className="text-primary/100 font-semibold font-heading text-subtitle-heading leading-normal tracking-normal">
                  {questionIndex + 1}. Question
                </label>
                <Textarea
                  {...register(`questions.${questionIndex}.questionText`)}
                  placeholder="A 60-year-old woman presents with..."
                  className="min-h-[100px]"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col items-start justify-center gap-2 w-full">
                <label className="text-primary/100 font-semibold font-heading text-subtitle-heading leading-normal tracking-normal">
                  Options
                </label>
                <div className="grid grid-cols-1 w-full md:grid-cols-2 items-center justify-center gap-4">
                  {[0, 1, 2, 3].map((optionIndex) => {
                    const option = watch(
                      `questions.${questionIndex}.options.${optionIndex}`
                    );
                    return (
                      <div
                        key={optionIndex}
                        className="flex items-center justify-center gap-2"
                      >
                        <button
                          onClick={() =>
                            toggleCorrectAnswer(questionIndex, optionIndex)
                          }
                          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            option?.isCorrect
                              ? "bg-primary border-primary"
                              : "border-gray-300 hover:border-primary"
                          }`}
                          title="Mark as correct answer"
                        >
                          {option?.isCorrect && (
                            <Icons.Check size={12} className="text-white" />
                          )}
                        </button>
                        <Input
                          {...register(
                            `questions.${questionIndex}.options.${optionIndex}.text`
                          )}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1"
                          disabled={isSubmitting}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className=" flex-col items-start justify-center gap-2 w-full hidden">
                <label className="text-primary/100 font-semibold font-heading text-subtitle-heading leading-normal tracking-normal">
                  Answer
                </label>
                <div className="grid grid-cols-1 w-full md:grid-cols-2 items-center justify-center gap-4">
                  <Input
                    placeholder="Internal carotid artery"
                    type="text"
                    className="max-w-lg self-start"
                    autoCapitalize="none"
                  />
                  <div />
                </div>
              </div>
              <div className="flex flex-col items-start justify-center gap-2 w-full">
                <label className="text-primary/100 font-semibold font-heading text-subtitle-heading leading-normal tracking-normal">
                  Explanation
                </label>
                <div className="grid grid-cols-1 w-full md:grid-cols-1 items-center justify-center gap-4">
                  <Textarea
                    {...register(`questions.${questionIndex}.explanation`)}
                    disabled={isSubmitting}
                    placeholder="This clinical presentation describes Horner's Syndrome..."
                    className="min-h-[280px]"
                    autoCapitalize="none"
                  />
                </div>
              </div>
            </div>
          ))}

          {fields.length < 19 && (
            <button
              type="button"
              title="Add question"
              onClick={addQuestion}
              className="p-2 bg-ring/20 cursor-pointer rounded-lg hover:bg-blue-50 transition-colors flex items-center self-end max-w-4xl"
            >
              <Icons.Plus size={16} />
            </button>
          )}

          <Button className="cursor-pointer" type="submit" size={"xl"}>
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AddQuestions;
