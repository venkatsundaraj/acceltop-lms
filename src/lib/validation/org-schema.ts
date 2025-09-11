import z from "zod";

export const orgValidation = z.object({
  name: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  slug: z
    .string()
    .min(1, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  description: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  organizationType: z.enum(["creator", "institute", "tutor", "publisher"]),
  focusExams: z.array(z.string()).min(1, "Select at least one exam focus"),
  contactEmail: z.string().email().optional(),
  //   address: z.string().optional(),
  //   logo: z.string().optional(),
  //   bannerImage: z.string().optional(),
  //   .regex(
  //       /^(\+\d{1,3}[- ]?)?\d{10}$/,
  //       "Please enter a valid phone number (10 digits, optional country code)")
  //   status: z.enum(["pending", "active", "inactive"]).optional(),
  //   isPublic: z.boolean().default(false),
  //   isSetupCompleted: z.boolean().default(false),
  //   settings: z.string().optional(),
});

export type OrgValidationType = z.infer<typeof orgValidation>;
