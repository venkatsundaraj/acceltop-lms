"use client";

import { Icons } from "@/app/_components/miscellaneous/lucide-react";
import { useOrgContext } from "@/app/_components/providers/org-providers/org-provider";
import { Button } from "@/app/_components/ui/button";
import { slugify } from "@/lib/utils";
import {
  FilterCategory,
  filterCategory,
} from "@/lib/validation/category-user/qbank";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface TestModeFormProps {}

const TestModeForm: FC<TestModeFormProps> = ({}) => {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<boolean>();
  const [subCategoryDropdownOpen, setSubCategoryDropdownOpen] =
    useState<boolean>();

  const categoryRef = useRef<HTMLDivElement>(null);
  const subCategoryRef = useRef<HTMLDivElement>(null);

  const { org, sessionUser } = useOrgContext();

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

  const selectedCategories = watch("category") || [];
  const selectedSubCategories = watch("subCategory") || [];

  const { data: categoryList } = api.orgUserQBank.getAllCategories.useQuery({
    organisationId: org.id,
  });

  const { data: subCategoryList } =
    api.orgUserQBank.getAllSubCategories.useQuery(
      {
        // categorySlug: slugify(categoryList?.length ? categoryList[0].name : ""),
        categorySlug: watch("category")
          ? watch("category").map((item) => slugify(item))
          : categoryList?.length
          ? [slugify(categoryList[0].name)]
          : [],
        organisationId: org.id,
      },
      { enabled: !!categoryList?.length || Boolean(watch("category")) }
    );

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

  const submitHandler = function (data: FilterCategory) {
    console.log(data);
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
                      checked={selectedCategories.includes(item.name)}
                      onChange={() => toggleCategory(item.name)}
                      type="checkbox"
                      className="bg-transparent"
                    />
                    <span>
                      {item.name} - {item.questions}
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
                      checked={selectedSubCategories.includes(item.name)}
                      onChange={() => toggleSubCategory(item.name)}
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
    </div>
  );
};

export default TestModeForm;

{
  /* <select
            disabled={isSubmitting}
            defaultValue={
              subCategoryList?.length ? subCategoryList[0].name : ""
            }
            className="w-full py-2 border/50 px-2 ring-1 ring-input rounded-md text-background"
            {...register("subCategory")}
          >
            {subCategoryList && subCategoryList?.length > 0 ? (
              subCategoryList?.map((item, i) => (
                <option value={item.name} id={item.id} key={item.id}>
                  {item.name}
                </option>
              ))
            ) : subCategoryList?.length === 0 ? (
              <option value={"No Subcategory"}>No Subcategory</option>
            ) : (
              <option value={"Loading..."}>Loading...</option>
            )}
          </select> */
}

{
  /* <select
            disabled={isSubmitting}
            {...register("category")}
            className="w-full py-2 border/50 px-2 ring-1 ring-input rounded-md text-background"
          >
            {categoryList?.map((item, i) => (
              <option value={item.name} id={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select> */
}
