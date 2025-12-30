import z from "zod";

export const statusOfTheQuestionsBank = [
  "completed",
  "incorrect",
  "attempted",
] as const;

export type StatusOfTheQuestionsBank =
  (typeof statusOfTheQuestionsBank)[number];

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

export const testConfigurationSchema = z.object({
  numberOfQuestions: z.number().min(2).max(200),
  timePerQuestion: z.number().min(1).max(5),
  maxQuestions: z.number().optional(),
});

export type TestConfiguration = z.infer<typeof testConfigurationSchema>;
