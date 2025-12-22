import z from "zod";

export const statusOfTheQuestionsBank = [
  "completed",
  "failed",
  "attempted",
] as const;

type StatusOfTheQuestionsBank = (typeof statusOfTheQuestionsBank)[number];

export const filterCategory = z.object({
  category: z.string().trim().min(1),
  subCategory: z.string().trim().min(1),
  status: z.enum(statusOfTheQuestionsBank),
});

export type FilterCategory = z.infer<typeof filterCategory>;
