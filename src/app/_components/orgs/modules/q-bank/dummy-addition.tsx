"use client";
import { Input } from "@/app/_components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";

interface DummyAdditionProps {}

const input = z.object({
  id: z.string(),
  text: z.string().refine((item) => item === "hello"),
});
const inputSchema = z.object({ input: z.array(input).min(2) });

type InputSchema = z.infer<typeof inputSchema>;

const DummyAddition: FC<DummyAdditionProps> = ({}) => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      input: Array(2)
        .fill(null)
        .map(() => ({ id: "", text: "" })),
    },
  });
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "input",
  });
  const submitHandler = function (data: InputSchema) {
    console.log(data);
  };
  return (
    <div className="w-full flex flex-col items-center justify-center gap-12">
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        {fields.map((item, i) => (
          <div className="flex flex-col items-start" key={i}>
            <Input
              placeholder="text"
              type="text"
              {...register(`input.${i}.id`)}
            />
            <Input
              placeholder="id"
              key={i}
              type="text"
              {...register(`input.${i}.text`)}
            />
          </div>
        ))}
        <button>add</button>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default DummyAddition;
