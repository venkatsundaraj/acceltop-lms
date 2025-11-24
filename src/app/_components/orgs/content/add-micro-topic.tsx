"use client";

import { category, SubCategoryType } from "@/server/db/index-schema";
import { FC } from "react";
import { Button } from "@/app/_components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  microTopicSchema,
  MicroTopicValidation,
} from "@/lib/validation/category-schema";
import { Input } from "@/app/_components/ui/input";
import { slugify } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Icons } from "../../miscellaneous/lucide-react";

interface AddMicroTopicProps {
  subCategory: SubCategoryType & { organisationId: string };
}

const AddMicroTopic: FC<AddMicroTopicProps> = ({ subCategory }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<MicroTopicValidation>({
    resolver: zodResolver(microTopicSchema),
    defaultValues: {
      categorySlug: subCategory.slug,
      organisationId: subCategory.organisationId,
      subCategoryId: subCategory.id,
    },
  });
  const isOptimistic =
    subCategory.id.startsWith("temp") || subCategory.id === "temp-id";
  const apiClient = api.useUtils();
  const { data: microTopicList } =
    api.contentManagement.getAllMicroTopics.useQuery(
      {
        subCategoryId: subCategory.id,
      },
      {
        enabled: !isOptimistic,
        retry: false,
      }
    );

  const { mutateAsync: uploadCategory, isPending } =
    api.contentManagement.addMicroTopic.useMutation({
      onMutate: async (data) => {
        await apiClient.contentManagement.getAllMicroTopics.cancel();
        const prev =
          await apiClient.contentManagement.getAllMicroTopics.getData();

        await apiClient.contentManagement.getAllMicroTopics.setData(
          { subCategoryId: subCategory.id },
          (old) => {
            if (!old) return old;
            return [
              ...old,
              {
                id: "temp-id",
                subCategoryId: subCategory.id,
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
        toast("The micro topic has been added");
      },
      onError: (err) => {
        toast("Something went wrong");
      },
      onSettled: () => {
        apiClient.contentManagement.getAllMicroTopics.invalidate();
      },
    });

  //have to update the server actions
  const submitHandler = async function (data: MicroTopicValidation) {
    const res = await uploadCategory({
      title: data.title,
      subCategoryId: subCategory.id,
    });
    if (Boolean(res)) {
      reset();
    }
  };

  const deleteHandler = function (id: string) {};
  return (
    <Dialog>
      <DialogTrigger asChild>
        <li
          key={subCategory.id}
          className="border-2 hover:bg-accent/70 cursor-pointer border-accent text-primary w-full flex items-center justify-center text-tertiary-heading font-normal leading-normal tracking-tight py-2 rounded-md "
        >
          {subCategory.name}
        </li>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[60vw]">
        <DialogHeader>
          <DialogTitle className="w-full text-center text-primary font-heading font-normal leading-normal tracking-tight text-2xl">
            Please add micro topics
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="w-full py-8 flex flex-col items-center justify-center gap-8"
        >
          <Input
            type="text"
            autoCapitalize="none"
            placeholder="Micro Topics"
            {...register("title")}
          />
          <Button type="submit" size={"lg"} disabled={isSubmitting}>
            Add
          </Button>
        </form>
        <ul className="container md:p-4 gap-x-2 gap-y-4 flex flex-wrap items-center justify-center">
          {microTopicList?.map((item, i) => (
            <li
              key={item.id}
              className=" flex gap-3 items-center bg-accent text-primary p-0 justify-center text-subtitle-heading font-normal leading-normal tracking-tight px-2 "
            >
              {item.name}
              <Button size={"sm"} className="rounded-none cursor-pointer">
                <Icons.X
                  onClick={() => deleteHandler(item.id)}
                  className="w-4"
                />
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default AddMicroTopic;
