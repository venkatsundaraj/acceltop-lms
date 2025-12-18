import z from "zod";

// const hello = ['one', 'two', 'three'] as const

// const helloEnum= z.enum(hello)
// type HelloType = z.infer<typeof helloEnum>
// const val: HelloType = "three";

export const qBankValues = [
  "multiple_choice",
  "true_false",
  "sigle_choice",
  "fill_in_bank",
  "match_following",
  "clinical_based",
  "image_based",
] as const;

export type QBankType = (typeof qBankValues)[number];

export const qBankSchema = z.object({
  title: z.string().min(10),
  category: z.string().min(1),
  subCategory: z
    .string()
    .min(1)
    .refine((str) => str !== "No Subcategory"),
});

export type QBankSchemaType = z.infer<typeof qBankSchema>;

//questions

export const optionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Option text is required"),
  url: z
    .string()
    .min(1, "Option text is required")
    .optional()
    .or(z.literal("")),
  isCorrect: z.boolean(),
});

export const questionSchema = z.object({
  id: z.string(),
  hello: z.string().optional(),
  questionText: z.string(),
  options: z
    .array(optionSchema)
    .min(2, "At least 2 options required")
    .max(6, "Maximum 6 options allowed")
    .refine(
      (options) => options.filter((op) => op.isCorrect).length === 1,
      "Exactly one option must be marked as correct"
    ),
  explanation: z.string(),
});

export const questionFormSchema = z.object({
  questions: z
    .array(questionSchema)
    .min(2, "You must add at least 10 questions")
    .max(18, "Maximum 50 questions allowed"),
  // qbankId: z.string().min(1, "Question bank is required"),
  // microTopicId: z.string().min(1, "Micro topic is required"),
});

export type QuestionFormData = z.infer<typeof questionFormSchema>;
