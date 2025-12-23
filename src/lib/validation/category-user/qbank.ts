import z from "zod";

export const statusOfTheQuestionsBank = [
  "completed",
  "failed",
  "attempted",
] as const;

type StatusOfTheQuestionsBank = (typeof statusOfTheQuestionsBank)[number];

export const filterCategory = z.object({
  category: z.array(z.string()).min(1),
  subCategory: z.array(z.string()).min(1),
  status: z.enum(statusOfTheQuestionsBank),
});

export const filterCategoryWithoutStatus = filterCategory.omit({
  status: true,
});

export type FilterCategory = z.infer<typeof filterCategory>;
export type FilterCategoryWithoutStatus = z.infer<
  typeof filterCategoryWithoutStatus
>;
