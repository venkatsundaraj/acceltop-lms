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

export const createTable = pgTableCreator((name) => `acceltop_${name}`);

export const userRoleEnum = pgEnum("user_role", ["admin", "org_user", "org"]);
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "pending",
]);

export const organisation = pgTable("organisation", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  website: text("website"),
  description: text("description"),
  logo: text("logo"),
  bannerImage: text("banner_image"),
  contactEmail: text("contact_email"),
  isPublic: boolean("is_public").default(false).notNull(),
  isSetupCompleted: boolean("is_setup_completed").default(false).notNull(),
  status: userStatusEnum("status").default("active").notNull(),
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
  }>(),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),

  //addtion
  phone: text("phone"),
  userRole: userRoleEnum("role").default("org_user").notNull(),
  userStatus: userStatusEnum("status").default("pending").notNull(),
  organizationId: text("organisation_id").references(() => organisation.id, {
    onDelete: "cascade",
  }),
  signupSource: text("signup_source"),
  metadata: json("metadata").$type<{
    permissions?: string[];
    preferences?: Record<string, any>;
    onboardingCompleted?: boolean;
    studentInfo?: { studentId?: string; grade?: string; dateOfBirth?: string };
  }>(),
});

//default

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});
