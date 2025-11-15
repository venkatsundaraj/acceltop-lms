import { z } from "zod";

export const categorySchema = z.object({
  title: z.string().min(1),
});

export type CategoryValidation = z.infer<typeof categorySchema>;
