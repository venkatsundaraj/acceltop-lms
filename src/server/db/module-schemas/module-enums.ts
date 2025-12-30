import { pgEnum } from "drizzle-orm/pg-core";

export const moduleTypeEnum = pgEnum("module_type", [
  "qbank",
  "mcq",
  "flashcards",
  "live",
  "poscasts",
  "ebook",
  "videos",
  "tests",
]);

export const difficultyLevelEnum = pgEnum("difficulty_level", [
  "easy",
  "medium",
  "hard",
  "expert",
]);

export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
  "under_review",
  "archieved",
]);

export const questionTypeEnum = pgEnum("question_type", [
  "multiple_choice",
  "true_false",
  "sigle_choice",
  "fill_in_bank",
  "match_following",
  "clinical_based",
  "image_based",
]);

export const questiosStatusEnum = pgEnum("question_attempted_status", [
  "completed",
  "incorrect",
  "attempted",
]);

export const attemptedStatusEnum = pgEnum("attempted_status", [
  "in_progress",
  "completed",
]);
