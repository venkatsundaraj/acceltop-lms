import {
  boolean,
  integer,
  json,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { createTable, user } from "../schema";
import { organisation } from "../organisation";
import {
  contentStatusEnum,
  difficultyLevelEnum,
  questionTypeEnum,
} from "./module-enums";

export const category = createTable(
  "category",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    icon: text("icon"),
    organisationId: text("organisation_id")
      .notNull()
      .references(() => organisation.id, { onDelete: "cascade" }),

    order: integer("order").default(0),
    isActive: boolean("is_active").default(true),

    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueCategoryId: unique().on(table.organisationId, table.slug),
  })
);

export const subCategory = createTable(
  "sub_category",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),

    categoryId: text("category_id")
      .notNull()
      .references(() => category.id, {
        onDelete: "cascade",
      }),

    order: integer("order").default(0),
    isActive: boolean("is_active").default(true),

    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueCategorySlug: unique().on(table.categoryId, table.slug),
  })
);

export const microTopic = createTable(
  "micro_topic",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),

    subCategoryId: text("subcategory_id")
      .notNull()
      .references(() => subCategory.id, { onDelete: "cascade" }),

    order: integer("order").default(0),

    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueSubCategorySlug: unique().on(table.subCategoryId, table.slug),
  })
);

export const qbank = createTable("qbank", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),

  organisationId: text("organisation_id")
    .notNull()
    .references(() => organisation.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => category.id, { onDelete: "cascade" }),
  subCategoryId: text("subcategory_id")
    .notNull()
    .references(() => subCategory.id, { onDelete: "cascade" }),

  totalQuestions: integer("total_questions").default(0),
  estimatedTime: integer("estimated_time"),
  difficultyLevel: difficultyLevelEnum("difficulty_level"),

  isPublished: boolean("is_published").default(false).notNull(),
  allowPractice: boolean("allow_practice").default(true).notNull(),
  allowBookmark: boolean("allow_bookmark").default(true).notNull(),

  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const question = createTable(
  "question",
  {
    id: text("id").primaryKey(),
    questionText: text("question_test").notNull(),
    questionType: questionTypeEnum("question_type")
      .default("multiple_choice")
      .notNull(),

    qbankId: text("qbank_id")
      .notNull()
      .references(() => qbank.id),
    microTopicId: text("micro_topic_id").references(() => microTopic.id),

    images: json("images").$type<string[]>(),
    videos: json("videos").$type<string[]>(),

    options: json("options").$type<
      {
        id: string;
        text: string;
        image?: string;
        isCorrect: boolean;
      }[]
    >(),

    references: json("references").$type<
      {
        title: string;
        author?: string;
        url?: string;
        page?: string;
      }[]
    >(),

    explanation: text("explanation"),
    explanationImages: json("explanation_images").$type<string[]>(),
    explanationVideos: json("explanation_videos").$type<string[]>(),

    difficulty: difficultyLevelEnum("difficulty"),
    tags: json("tags").$type<string[]>(),

    timesAttempted: integer("times_attempted").default(0),
    timesCorrect: integer("times_correct").default(0),
    avgTimeSpent: integer("avg_time_spent").default(0),

    status: contentStatusEnum("status").default("draft").notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    createdBy: text("created_by")
      .notNull()
      .references(() => user.id),

    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
    publishedAt: timestamp("published_at"),
  },
  (table) => ({
    uniqueQuestions: unique().on(table.qbankId, table.questionText),
  })
);

export type SubCategoryType = typeof subCategory.$inferSelect;
export type ListOfQuestionsType = typeof question.$inferSelect;
