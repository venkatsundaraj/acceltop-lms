import {
  text,
  decimal,
  timestamp,
  boolean,
  json,
  unique,
} from "drizzle-orm/pg-core";
import { createTable, user } from "./schema";
import { organisation } from "./organisation";
import { subscriptionStatusEnum, subscriptionPlanEnum } from "./enums";

export const studentSubscription = createTable(
  "student_subscription",
  {
    id: text("id").primaryKey(),

    //relations
    organisationId: text("organisation_id")
      .references(() => organisation.id, { onDelete: "cascade" })
      .notNull(),
    studentId: text("student_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),

    //enums
    subscriptionPlan: subscriptionPlanEnum("subscription_plan")
      .default("free")
      .notNull(),
    status: subscriptionStatusEnum("status")
      .default("pending_payment")
      .notNull(),

    //plan price
    planPrice: decimal("plan_price", { precision: 10, scale: 2 }).default(
      "0.00"
    ),
    currency: text("currency").default("INR").notNull(),

    // Duration
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    trialEndDate: timestamp("trial_end_date"),

    autoRenew: boolean("auto_renew").default(false).notNull(),
    cancelledAt: timestamp("cancelled_at"),
    cancellationReason: text("cancellation_reason"),

    allowedCourses: json("allowed_courses").$type<string[]>(),
    allowedFeatures: json("allowed_features").$type<string[]>(),

    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
    metadata: json("metadata").$type<{
      enrollmentSource?: string; // "website", "app", "referral"
      referralCode?: string;
      discountApplied?: {
        code?: string;
        percentage?: number;
        amount?: number;
      };
      notes?: string;
    }>(),
  },
  (table) => ({
    uniqueStudentOrg: unique().on(table.studentId, table.organisationId),
  })
);

export type OrgUserSchema = typeof studentSubscription.$inferSelect;
