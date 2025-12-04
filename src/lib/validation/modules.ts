import z from "zod";

// const hello = ['one', 'two', 'three'] as const

// const helloEnum= z.enum(hello)
// type HelloType = z.infer<typeof helloEnum>
// const val: HelloType = "three";

export const qBankSchema = z.object({
  title: z.string().min(10),
  category: z.string().min(1),
  subCategory: z
    .string()
    .min(1)
    .refine((str) => str !== "No Subcategory"),
});

export type QBankSchemaType = z.infer<typeof qBankSchema>;
