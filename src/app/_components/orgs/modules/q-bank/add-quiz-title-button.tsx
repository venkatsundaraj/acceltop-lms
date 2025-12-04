"use client";

import { Icons } from "@/app/_components/miscellaneous/lucide-react";
import { Button } from "@/app/_components/ui/button";
import { FC, useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { qBankSchema, QBankSchemaType } from "@/lib/validation/modules";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/app/_components/ui/text-area";
import { useOrgContext } from "@/app/_components/providers/org-providers/org-provider";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { slugify } from "@/lib/utils";

interface AddQuizTitleButtonProps {}

const AddQuizTitleButton: FC<AddQuizTitleButtonProps> = ({}) => {
  const [open, setOpen] = useState<boolean>();

  const { org, sessionUser } = useOrgContext();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting },
    getValues,
  } = useForm<QBankSchemaType>({
    resolver: zodResolver(qBankSchema),
  });
  const utils = api.useUtils();
  const { data: categoryList } =
    api.contentManagement.getAllCategories.useQuery({ organisationId: org.id });

  const { data: subCategoryList } =
    api.contentManagement.getAllSubCategories.useQuery(
      {
        // categorySlug: slugify(categoryList?.length ? categoryList[0].name : ""),
        categorySlug: watch("category")
          ? slugify(watch("category"))
          : slugify(categoryList?.length ? categoryList[0].name : ""),
        organisationId: org.id,
      },
      { enabled: !!categoryList?.length || Boolean(watch("category")) }
    );

  useEffect(() => {
    if (subCategoryList?.length) {
      setValue("subCategory", subCategoryList[0].name);
    } else {
      setValue("subCategory", "");
    }
  }, [subCategoryList, setValue]);

  const { mutateAsync: addSubCategory } =
    api.orgQBank.addQbankTitle.useMutation({
      onSuccess: (data) => {
        if (data.success) {
          setOpen(false);
          reset();
          toast.success("Your qbank has been added");
        }
      },
      onMutate: (data) => {
        utils.orgQBank.getAllQbankDetails.cancel();
        const prev = utils.orgQBank.getAllQbankDetails.getData();
        utils.orgQBank.getAllQbankDetails.setData({ orgId: org.id }, (old) => {
          if (!old) return old;
          const itm = old.items.filter((item) => item.categoryName);
          return {
            success: true,
            items: !itm.length
              ? [
                  ...old.items,
                  {
                    categoryId: "hello",
                    categoryName: data.category,
                    categorySlug: "",
                  },
                ]
              : [...old.items],
          };
        });

        return { prev };
      },
      onSettled: () => {
        utils.orgQBank.getAllQbankDetails.invalidate();
      },
    });

  const submitHandler = async function (data: QBankSchemaType) {
    const categoryItem = categoryList?.find(
      (item) => item.name === watch("category")
    );
    const subCategoryItem = subCategoryList?.find(
      (item) => item.name === watch("subCategory")
    );

    if (!categoryItem?.id || !subCategoryItem?.id) return;
    await addSubCategory({
      ...data,
      categoryItem: categoryItem.id,
      subCategoryItem: subCategoryItem.id,
      orgId: org.id,
    });
  };
  return (
    <div className="w-full rounded-2xl bg-accent p-3 md:p-8 flex items-center justify-between mt-16">
      <div className="flex flex-col items-start justify-center gap-4">
        <h2 className="text-primary text-tertiary-heading leading-[0.9] text-center tracking-normal font-heading font-semibold">
          Please start adding your qbank details
        </h2>
        <p className="text-foreground/50 text-subtitle-heading text-center leading-tight font-paragraph font-normal max-w-2xl ">
          Personalize your questions however you want
        </p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={"lg"} className="min-w-[160px]">
            Add Q-Bank
            <Icons.Plus className="w-8 h-8 stroke-background stroke-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="!text-tertiary-heading w-full text-center font-semibold leading-normal tracking-normal text-primary">
              Add Question Bank Title
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col items-center justify-between gap-8"
          >
            <Textarea
              disabled={isSubmitting}
              {...register("title")}
              draggable="false"
              className="min-w-[90%]"
              placeholder="Ventricular System, White Matter, and Neural Columns..."
            />
            <div className="min-w-[90%] w-full grid grid-cols-2 items-center gap-6 justify-center">
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <label
                  id="category"
                  className="text-[14px] text-muted-foreground font-normal font-heading"
                >
                  Category
                </label>
                <select
                  disabled={isSubmitting}
                  className="w-full py-2 ring-1 ring-input focus-visible:ring-1 px-2 rounded-md"
                  {...register("category")}
                >
                  {categoryList?.map((item, i) => (
                    <option value={item.name} id={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <label
                  id="subcategory"
                  className="text-[14px] text-muted-foreground font-normal font-heading"
                >
                  Subcategory
                </label>
                <select
                  disabled={isSubmitting}
                  defaultValue={
                    subCategoryList?.length ? subCategoryList[0].name : ""
                  }
                  className="w-full py-2 border/50 px-2 ring-1 ring-input rounded-md"
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
            </div>
            <Button disabled={isSubmitting} type="submit">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AddQuizTitleButton;
