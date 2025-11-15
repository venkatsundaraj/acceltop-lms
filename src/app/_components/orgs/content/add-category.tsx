"use client";
import { FC } from "react";
import { Input } from "@/app/_components/ui/input";
import { useForm } from "react-hook-form";
import {
  categorySchema,
  CategoryValidation,
} from "@/lib/validation/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../ui/button";

interface AddCategoryProps {}

const AddCategory: FC<AddCategoryProps> = ({}) => {
  const {
    register,
    formState: { errors, isLoading, isSubmitting },
    reset,
    handleSubmit,
  } = useForm<CategoryValidation>({
    resolver: zodResolver(categorySchema),
  });

  //have to update the server actions
  const submitHandler = function (data: CategoryValidation) {
    console.log(data);
    reset();
  };
  return (
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
          disabled={isSubmitting}
          className="rounded-sm border-foreground/60 min-w-[325px]"
          {...register("title")}
        />
        <Button type="submit">Add</Button>
      </div>
    </form>
  );
};

export default AddCategory;
