import {
  pgTableCreator,
  serial,
  text,
  timestamp,
  pgTable,
  boolean,
  integer,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";
import { userStatusEnum, organisationTypeEnum } from "./enums";

export const organisation = pgTable("organisation", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  website: text("website"),
  description: text("description"),
  logo: text("logo"),
  bannerImage: text("banner_image"),
  contactEmail: text("contact_email"),
  phone: text("phone"),
  address: text("address"),

  //status
  isPublic: boolean("is_public").default(false).notNull(),
  isSetupCompleted: boolean("is_setup_completed").default(false).notNull(),
  status: userStatusEnum("status").default("inactive").notNull(),

  //area focused
  organisationType: organisationTypeEnum("organisation_type")
    .default("creator")
    .notNull(),
  focusExams: json("focus_exams").$type<string[]>(),

  //timestamps
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
  settings: json("settings").$type<{
    allowStudentSelfSignup?: boolean;
    requireStudentApproval?: boolean;
    customTheme?: {
      primaryColor?: string;
      secondaryColor?: string;
      logo?: string;
    };
    features?: string[];
    onBoardingStep?: number;
    subscriptionPlan?: "free" | "premium" | "basic";
    billing?: {
      planStartDate?: string;
      planEndDate?: string;
      autoRenew?: boolean;
    };
  }>(),
});

export type OrgSchema = typeof organisation.$inferSelect;
