import { pgEnum } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "pending",
]);
export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "org_user",
  "org",
  "none",
]);

export const examTypeEnum = pgEnum("examType", [
  "jee",
  "upsc",
  "neet",
  "cat",
  "banking",
  "ssc",
  "gate",
  "other",
]);

export const organisationTypeEnum = pgEnum("organisation_type", [
  "creator",
  "institute",
  "publisher",
  "tutor",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "pending_payment",
  "expired",
  "cancelled",
  "trial",
]);

export const subscriptionPlanEnum = pgEnum("subscritpion_plan", [
  "free",
  "basic",
  "premium",
  "enterprise",
]);
