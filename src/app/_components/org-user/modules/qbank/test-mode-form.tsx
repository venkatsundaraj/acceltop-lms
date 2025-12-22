"use client";

import { useOrgContext } from "@/app/_components/providers/org-providers/org-provider";
import { Button } from "@/app/_components/ui/button";
import { slugify } from "@/lib/utils";
import {
  FilterCategory,
  filterCategory,
} from "@/lib/validation/category-user/qbank";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface TestModeFormProps {}

const TestModeForm: FC<TestModeFormProps> = ({}) => {
  const { org, sessionUser } = useOrgContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FilterCategory>({
    resolver: zodResolver(filterCategory),
  });

  const { data: categoryList } = api.orgUserQBank.getAllCategories.useQuery({
    organisationId: org.id,
  });

  const { data: subCategoryList } =
    api.orgUserQBank.getAllSubCategories.useQuery(
      {
        // categorySlug: slugify(categoryList?.length ? categoryList[0].name : ""),
        categorySlug: watch("category")
          ? slugify(watch("category"))
          : slugify(categoryList?.length ? categoryList[0].name : ""),
        organisationId: org.id,
      },
      { enabled: !!categoryList?.length || Boolean(watch("category")) }
    );

  const submitHandler = function (data: FilterCategory) {
    console.log(data);
  };
  return (
    <div className="bg-primary rounded-2xl px-8 py-16 mt-16">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="grid grid-cols-2 md:grid-cols-4 items-center justify-center mt-8 gap-8"
      >
        <div className="flex flex-col items-start gap-4 justify-center">
          <label
            id="category"
            className="text-[14px] text-background font-normal font-heading"
          >
            Category
          </label>
          <select
            disabled={isSubmitting}
            {...register("category")}
            className="w-full py-2 border/50 px-2 ring-1 ring-input rounded-md text-background"
          >
            {categoryList?.map((item, i) => (
              <option value={item.name} id={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-start gap-4 justify-center">
          <label
            id="category"
            className="text-[14px] text-background font-normal font-heading"
          >
            Subcategory
          </label>
          <select
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
          </select>
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
