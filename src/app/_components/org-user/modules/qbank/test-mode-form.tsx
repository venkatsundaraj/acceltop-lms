"use client";

import { Icons } from "@/app/_components/miscellaneous/lucide-react";
import { useOrgContext } from "@/app/_components/providers/org-providers/org-provider";
import { Button } from "@/app/_components/ui/button";
import { cn, slugify } from "@/lib/utils";
import {
  FilterCategory,
  filterCategory,
  testConfigurationSchema,
  TestConfiguration,
  StatusOfTheQuestionsBank,
} from "@/lib/validation/category-user/qbank";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Slider } from "@/app/_components/ui/slider";
import { toast } from "sonner";
import { useUserQBankContext } from "@/app/_components/providers/org-user-providers/modules/q-bank-provider";

interface TestModeFormProps {}

const TestModeForm: FC<TestModeFormProps> = ({}) => {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>();
  const [subCategoryDropdownOpen, setSubCategoryDropdownOpen] =
    useState<boolean>();
  const [filteredTopics, setFilteredTopics] = useState<{
    category: { id: string; name: string }[];
    subCategory: { id: string; name: string }[];
    status: StatusOfTheQuestionsBank;
  }>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const subCategoryRef = useRef<HTMLDivElement>(null);

  const { org, sessionUser } = useOrgContext();
  const { startTest } = useUserQBankContext();

  useEffect(() => {
    const handleClick = function (evnet: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event?.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
      if (
        subCategoryRef.current &&
        !subCategoryRef.current.contains(event?.target as Node)
      ) {
        setSubCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FilterCategory>({
    resolver: zodResolver(filterCategory),
    defaultValues: {
      category: [],
      subCategory: [],
      status: "completed",
    },
  });

  const testConfigForm = useForm<TestConfiguration>({
    resolver: zodResolver(testConfigurationSchema),
    defaultValues: {
      numberOfQuestions: 50,
      timePerQuestion: 2,
    },
  });

  const selectedCategories = watch("category") || [];
  const selectedSubCategories = watch("subCategory") || [];

  const numberOfQuestions = testConfigForm.watch("numberOfQuestions");
  const timePerQuestion = testConfigForm.watch("timePerQuestion");

  const totalTime = numberOfQuestions * timePerQuestion;

  const { data: categoryList } = api.orgUserQBank.getAllCategories.useQuery({
    organisationId: org.id,
  });

  const { data: subCategoryList } =
    api.orgUserQBank.getAllSubCategories.useQuery(
      {
        categorySlug: watch("category")
          ? watch("category").map((item) => item)
          : categoryList?.length
          ? [categoryList[0].id]
          : [],
        organisationId: org.id,
      },
      { enabled: !!categoryList?.length || Boolean(watch("category")) }
    );

  const { mutateAsync: getQbankData, isPending } =
    api.orgUserQBank.getAllQuestionBankFromCategoryAndSubcategory.useMutation({
      onSuccess: (data) => {
        if (!data.length) return;
        const totalQuestions = data
          .map((item) => (item.totalQuestions ? item.totalQuestions : 0))
          .reduce((cur, last) => cur + last, 0);

        const maxAllowed = Math.min(totalQuestions, 200);
        testConfigForm.setValue("numberOfQuestions", maxAllowed);
        testConfigForm.setValue("maxQuestions", maxAllowed);
      },
      onSettled: (data) => {
        toast.success("Please confirm your inputs");
      },
    });
  const toggleCategory = function (categoryName: string) {
    const newCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((c) => c !== categoryName)
      : [...selectedCategories, categoryName];

    setValue("category", newCategories);
    if (newCategories.length === 0) {
      setValue("subCategory", []);
    }
  };

  const toggleSubCategory = (subCategoryName: string) => {
    const newSubCategories = selectedSubCategories.includes(subCategoryName)
      ? selectedSubCategories.filter((c) => c !== subCategoryName)
      : [...selectedSubCategories, subCategoryName];

    setValue("subCategory", newSubCategories);
  };

  const startTestHandler = async function (data: TestConfiguration) {
    await startTest(
      data.numberOfQuestions,
      filteredTopics?.category.map((item) => item.id) ?? [],
      filteredTopics?.subCategory.map((item) => item.id) ?? [],
      filteredTopics?.status || "attempted"
    );
  };

  const submitHandler = async function (data: FilterCategory) {
    const { category, subCategory, status } = data;
    const catList = categoryList
      ?.map((item, i) =>
        category.includes(item.id)
          ? { name: item.name, id: item.id }
          : { name: "", id: "" }
      )
      .filter((item) => Boolean(item.id));
    const subCatList = subCategoryList
      ?.map((item, i) =>
        subCategory.includes(item.id)
          ? { name: item.name, id: item.id }
          : { name: "", id: "" }
      )
      .filter((item) => Boolean(item.id));

    if (!catList?.length || !subCatList?.length) return;

    setFilteredTopics({ category: catList, subCategory: subCatList, status });
    await getQbankData({
      categoryIds: catList.map((item) => item.id),
      subCategoryIds: subCatList.map((item) => item.id),
      organisationId: org.id,
    });
    setDialogOpen(true);
  };
  return (
    <div className="bg-primary rounded-2xl px-8 py-16 mt-16">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="grid grid-cols-2 md:grid-cols-4 items-center justify-center gap-8"
      >
        <div className="flex flex-col items-start gap-4 justify-center">
          <label
            id="category"
            className="text-[14px] text-background font-normal font-heading"
          >
            Category
          </label>
          <div
            ref={categoryRef}
            className="flex items-center justify-center w-full relative "
          >
            <Button
              type="button"
              className="border-[0.5px] w-full border-background hover:bg-background/10 justify-between"
              variant={"outline"}
              onClick={() => setCategoryDropdownOpen((prev) => !prev)}
            >
              <span className="text-background cursor-pointer  text-[14px] font-heading font-normal leading-normal tracking-normal">
                Select Categories
              </span>
              <Icons.ChevronDown className="w-4 h-4 stroke-background" />
            </Button>
            {categoryDropdownOpen && (
              <div className="flex flex-col items-start justify-center z-10 absolute top-[120%] rounded-md shadow-sm w-full left-0 bg-accent p-4 gap-1.5 max-h-[300px] overflow-scroll">
                {categoryList?.map((item, i) => (
                  <label
                    key={i}
                    className="flex items-center justify-start gap-4"
                  >
                    <input
                      checked={selectedCategories.includes(item.id)}
                      onChange={() => toggleCategory(item.id)}
                      type="checkbox"
                      className="bg-transparent"
                    />
                    <span>
                      {item.name} ({item.questions})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 justify-center">
          <label
            id="category"
            className="text-[14px] text-background font-normal font-heading"
          >
            Subcategory
          </label>
          <div
            ref={subCategoryRef}
            className="flex items-center justify-center w-full relative"
          >
            <Button
              type="button"
              className="border-[0.5px] w-full border-background hover:bg-background/10 justify-between"
              variant={"outline"}
              onClick={() => setSubCategoryDropdownOpen((prev) => !prev)}
            >
              <span className="text-background cursor-pointer  text-[14px] font-heading font-normal leading-normal tracking-normal">
                Select Subcategories
              </span>
              <Icons.ChevronDown className="w-4 h-4 stroke-background" />
            </Button>
            {subCategoryDropdownOpen && (
              <div className="flex flex-col items-start justify-center z-10 absolute top-[120%] rounded-md shadow-sm w-full left-0 bg-accent p-4 gap-1.5 max-h-[300px] overflow-scroll">
                {subCategoryList?.map((item, i) => (
                  <label
                    key={i}
                    className="flex items-center justify-start gap-4"
                  >
                    <input
                      checked={selectedSubCategories.includes(item.id)}
                      onChange={() => toggleSubCategory(item.id)}
                      type="checkbox"
                      className="bg-transparent"
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 justify-center">
          <label
            id="category"
            className="text-[14px] text-background font-normal font-heading"
          >
            Status
          </label>
          <select
            defaultValue={"completed"}
            disabled={isSubmitting}
            {...register("status")}
            className="w-full py-2 border/50 px-2 ring-1 ring-input rounded-md text-background"
          >
            <option value={"completed"}>Completed</option>
            <option value={"failed"}>Failed</option>
            <option value={"attempted"}>Attempted</option>
          </select>
        </div>
        <div className="flex items-center justify-center">
          <Button
            disabled={isSubmitting}
            variant={"default"}
            size={"lg"}
            className="bg-white text-primary w-full max-w-[180px] hover:bg-white/90 cursor-pointer hover:text-primary"
            type="submit"
          >
            Start
          </Button>
        </div>
      </form>
      <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
        <DialogContent className="w-[78vw]  bg-primary py-16 border-none px-12">
          <DialogHeader>
            <DialogTitle className="w-full text-center !text-background text-secondary-heading font-semibold font-heading leading-normal tracking-normal">
              Please confirm your assessment here.
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={testConfigForm.handleSubmit(startTestHandler)}>
            <div className="w-full grid items-center justify-center grid-cols-1 md:grid-cols-2 min-h-[40vh] mt-12">
              <div className="flex items-start justify-betweem flex-col h-full gap-16">
                <div className="flex flex-col items-start justify-center gap-4">
                  <h3 className="w-full text-background text-paragraph-heading font-heading font-normal leading-normal tracking-normal">
                    Selected categories
                  </h3>
                  <ul className="flex items-center justify-center gap-3">
                    {filteredTopics?.category.slice(0, 3).map((item) => (
                      <li
                        className="bg-background px-2 py-1 text-primary  font-normal text-extra-subtitle-heading font-paragraph"
                        key={item?.id}
                      >
                        {item?.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-start justify-center gap-4">
                  <h3 className="w-full text-background text-paragraph-heading font-heading font-normal leading-normal tracking-normal">
                    Selected Subcategories
                  </h3>
                  <ul className="flex items-center justify-center gap-3">
                    {filteredTopics?.subCategory.slice(0, 3).map((item) => (
                      <li
                        className="bg-background px-2 py-1 text-primary  font-normal text-extra-subtitle-heading font-paragraph"
                        key={item?.id}
                      >
                        {item?.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-start justify-center gap-2.5">
                  <p className="w-full text-background text-subtitle-heading font-paragraph leading-normal font-bold tracking-normal">
                    Please note the following instructions
                  </p>
                  <ul className="flex flex-col items-start justify-center gap-1">
                    <li className="text-background text-[14px] font-paragraph leading-normal font-normal tracking-normal">
                      Each questions will have 1/2 min to attempt.
                    </li>
                    <li className="text-background text-[14px] font-paragraph leading-normal font-normal tracking-normal">
                      You can select 200 questions max per attempt
                    </li>
                    <li className="text-background text-[14px] font-paragraph leading-normal font-normal tracking-normal">
                      Brief review will be shared at the end of the practice
                      session.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-full gap-8">
                <div className="flex items-center justify-center min-w-[180px] aspect-square bg-background rounded-full">
                  <span className="font-heading flex items-center justify-center font-semibold text-tertiary-heading leading-normal tracking-normal text-center text-primary">
                    {isPending ? <Icons.Loader2 className="" /> : totalTime}{" "}
                    <br />
                    minutes
                  </span>
                </div>
                <div className="flex flex-col items-start justify-center gap-2">
                  <Slider
                    value={[numberOfQuestions]}
                    max={testConfigForm.watch("maxQuestions") || 200}
                    onValueChange={(value) =>
                      testConfigForm.setValue("numberOfQuestions", value[0])
                    }
                    step={1}
                    className={cn("w-[200px]")}
                  />
                  <p className="self-end font-heading font-normal text-paragraph-heading text-background">
                    {numberOfQuestions} /{" "}
                    <span className="font-bold">
                      {testConfigForm.watch("maxQuestions") || 200}
                    </span>
                  </p>
                </div>
                <Button
                  variant={"default"}
                  size={"lg"}
                  className="bg-white text-primary w-full max-w-[180px] hover:bg-white/90 cursor-pointer hover:text-primary"
                  type="submit"
                >
                  Start
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestModeForm;
