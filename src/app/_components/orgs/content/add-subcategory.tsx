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

import AddMicroTopic from "./add-micro-topic";

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
        const tempId = `temp-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        await apiClient.contentManagement.getAllSubCategories.setData(
          { categorySlug: slugify(category), organisationId: org.id },
          (old) => {
            if (!old) return old;
            return [
              ...old,
              {
                id: "temp-id",
                categoryId: tempId,
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
        apiClient.contentManagement.getAllSubCategories.invalidate();
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
      <ul className="container md:p-12 grid grid-cols-1 gap-6 md:grid-cols-3 items-center justify-center">
        {subCategoryList?.map((item, i) => (
          <AddMicroTopic
            key={item.id}
            subCategory={{ ...item, organisationId: org.id }}
          />
        ))}
      </ul>
    </div>
  );
};

export default AddSubCategory;
