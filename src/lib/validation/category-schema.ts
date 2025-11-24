import { title } from "process";
import { z } from "zod";

export const microTopicSchema = z.object({
  title: z.string().trim().min(1),
  categorySlug: z.string().trim().min(1),
  organisationId: z.string().trim().min(1),
  subCategoryId: z.string().trim().min(1),
});

export const subCategorySchema = microTopicSchema.omit({ subCategoryId: true });

export const categorySchema = microTopicSchema.omit({
  categorySlug: true,
  subCategoryId: true,
});

export type CategoryValidation = z.infer<typeof categorySchema>;
export type SubCategoryValidation = z.infer<typeof subCategorySchema>;
export type MicroTopicValidation = z.infer<typeof microTopicSchema>;
