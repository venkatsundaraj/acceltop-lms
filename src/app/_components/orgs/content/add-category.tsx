"use client";
import { FC, useState } from "react";
import { Input } from "@/app/_components/ui/input";
import { useForm } from "react-hook-form";
import {
  categorySchema,
  CategoryValidation,
} from "@/lib/validation/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/_components/ui/button";
import { api } from "@/trpc/react";
import { Toaster } from "@/app/_components/ui/sonner";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import Link from "next/link";
import { useOrgContext } from "../../providers/org-providers/org-provider";

interface AddCategoryProps {}

const AddCategory: FC<AddCategoryProps> = ({}) => {
  const {
    register,
    formState: { errors, isLoading, isSubmitting },
    reset,
    handleSubmit,
  } = useForm<CategoryValidation>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      organisationId: "org-id",
    },
  });

  const { org } = useOrgContext();

  const apiClient = api.useUtils();
  const { data: categoryList } =
    api.contentManagement.getAllCategories.useQuery({ organisationId: org.id });

  const { mutateAsync: uploadCategory, isPending } =
    api.contentManagement.addCategory.useMutation({
      onMutate: async (data) => {
        await apiClient.contentManagement.getAllCategories.cancel();
        const prev =
          await apiClient.contentManagement.getAllCategories.getData();

        apiClient.contentManagement.getAllCategories.setData(
          { organisationId: org.id },
          (old) => {
            if (!old) return old;

            return [
              ...old,
              {
                id: "temp-id",
                organisationId: "temp-org-id",
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
        toast("The category has been added");
      },
      onError: (err) => {
        toast("Something went wrong");
      },
      onSettled: () => {
        apiClient.contentManagement.getAllCategories.invalidate();
      },
    });

  //have to update the server actions
  const submitHandler = async function (data: CategoryValidation) {
    console.log(data);
    await uploadCategory({ title: data.title, organisationId: org.id });
    reset();
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
            placeholder="Category"
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
      <ul className="container md:p-12 grid grid-cols-1 gap-4 md:grid-cols-4 items-center justify-center">
        {categoryList?.map((item, i) => (
          <Link
            key={item.id}
            href={`/org/${org?.slug}/content/category/${item.slug}`}
          >
            <li className="border-2 border-accent hover:bg-accent/70 cursor-pointer text-primary w-full flex items-center justify-center text-tertiary-heading font-normal leading-normal tracking-tight py-2 rounded-md ">
              {item.name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default AddCategory;
