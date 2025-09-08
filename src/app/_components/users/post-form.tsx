"use client";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";

interface PostFormProps {}

const PostForm: FC<PostFormProps> = ({}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const utils = api.useUtils();
  const { mutate: addFile } = api.admin.uploadPost.useMutation({
    onSuccess: (data) => {
      console.log("success", data);
      utils.admin.getAllPosts.invalidate();
    },
    onMutate: async () => {
      await utils.admin.getAllPosts.cancel();

      const previousPost = utils.admin.getAllPosts.getData();
      // utils.admin.getAllPosts.setData(undefined, (old) => [...old ]);

      return { previousPost };
    },
  });
  const submitHandler = function (e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = addFile({ text: inputValue });
    console.log(val);
  };

  const changeHandler = function (e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-6">
      <input
        className="border border-foreground"
        onChange={(e) => changeHandler(e)}
        type="text"
      />
      <Button>submit</Button>
    </form>
  );
};

export default PostForm;
