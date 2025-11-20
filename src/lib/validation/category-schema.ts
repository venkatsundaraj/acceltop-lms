import { title } from "process";
import { z } from "zod";

export const subCategorySchema = z.object({
  title: z.string().min(1),
  categorySlug: z.string().min(1),
  organisationId: z.string().min(1),
});

export const categorySchema = subCategorySchema.omit({
  category: true,
  organisationId: true,
});

export type CategoryValidation = z.infer<typeof categorySchema>;
export type SubCategoryValidation = z.infer<typeof subCategorySchema>;
