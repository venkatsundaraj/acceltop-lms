"use client";
import { FC, useState } from "react";
import { Input } from "@/app/_components/ui/input";
import { useForm } from "react-hook-form";
import {
  categorySchema,
  CategoryValidation,
  subCategorySchema,
  SubCategoryValidation,
} from "@/lib/validation/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/_components/ui/button";
import { api } from "@/trpc/react";
import { Toaster } from "@/app/_components/ui/sonner";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import Link from "next/link";
import { useOrgContext } from "../../providers/org-providers/org-provider";
import { useParams } from "next/navigation";

interface AddSubCategoryProps {}

const AddSubCategory: FC<AddSubCategoryProps> = ({}) => {
  const {
    register,
    formState: { errors, isLoading, isSubmitting },
    reset,
    handleSubmit,
  } = useForm<SubCategoryValidation>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      organisationId: "orgId",
      categorySlug: "category",
    },
  });

  const { org } = useOrgContext();
  const { category } = useParams<{ orgname: string; category: string }>();

  const apiClient = api.useUtils();
  const { data: subCategoryList } =
    api.contentManagement.getAllSubCategories.useQuery({
      categorySlug: slugify(category),
      organisationId: org.id,
    });

  const { mutateAsync: uploadCategory, isPending } =
    api.contentManagement.addSubCategory.useMutation({
      onMutate: async (data) => {
        await apiClient.contentManagement.getAllSubCategories.cancel();
        const prev =
          await apiClient.contentManagement.getAllSubCategories.getData();

        await apiClient.contentManagement.getAllSubCategories.setData(
          { categorySlug: slugify(category), organisationId: org.id },
          (old) => {
            if (!old) return old;
            return [
              ...old,
              {
                id: "temp-id",
                categoryId: "temp-id",
                name: data.title,
                slug: slugify(data.title),
                createdAt: new Date(),
                updatedAt: new Date(),
                description: "",
                icon: "",
                order: 0,
                isActive: true,
              },
            ];
          }
        );
        return { prev };
      },
      onSuccess: (data) => {
        toast("The sub category has been added");
      },
      onError: (err) => {
        toast("Something went wrong");
      },
      onSettled: () => {
        // apiClient.contentManagement.getAllCategories.invalidate();
      },
    });

  //have to update the server actions
  const submitHandler = async function (data: SubCategoryValidation) {
    const res = await uploadCategory({
      title: data.title,
      categorySlug: slugify(category),
      organisationId: org.id,
    });
    if (Boolean(res)) {
      reset();
    }
  };
  return (
    <div className="container flex flex-col items-center justify-start gap-12">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex items-center justify-center w-full"
      >
        <div className="flex items-center justify-center gap-2">
          <Input
            autoCapitalize="none"
            autoComplete="none"
            placeholder="Sub Category"
            id="website"
            disabled={isPending}
            className="rounded-sm border-foreground/60 min-w-[325px]"
            {...register("title")}
          />
          <Button disabled={isPending} type="submit">
            Add
          </Button>
        </div>
      </form>
      <ul className="w-full grid grid-cols-1 gap-1.5 md:grid-cols-3 items-center justify-center">
        {subCategoryList?.map((item, i) => (
          <li
            key={item.id}
            className="border-2 border-accent text-primary w-full flex items-center justify-center text-tertiary-heading font-normal leading-normal tracking-tight py-2 rounded-md "
          >
            <h3>{item.name}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddSubCategory;
