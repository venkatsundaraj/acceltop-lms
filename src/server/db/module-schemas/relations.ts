import { relations } from "drizzle-orm";
import { category, microTopic, qbank, question, subCategory } from "./category";
import { organisation } from "../organisation";
import { user } from "../schema";

export const categoryRelations = relations(category, ({ one, many }) => ({
  organisation: one(organisation, {
    fields: [category.organisationId],
    references: [organisation.id],
  }),
  subCategory: many(subCategory),
  qbank: many(qbank),
}));

export const subCategoryRelations = relations(subCategory, ({ one, many }) => ({
  category: one(category, {
    fields: [subCategory.categoryId],
    references: [category.id],
  }),
  qbank: many(subCategory),
  microTopic: many(microTopic),
}));

export const microTopicRelations = relations(microTopic, ({ one, many }) => ({
  subCategory: one(subCategory, {
    fields: [microTopic.subCategoryId],
    references: [subCategory.id],
  }),
  question: many(question),
}));

export const qbankRelations = relations(qbank, ({ one, many }) => ({
  organisation: one(organisation, {
    fields: [qbank.organisationId],
    references: [organisation.id],
  }),
  category: one(category, {
    fields: [qbank.categoryId],
    references: [category.id],
  }),
  subCategory: one(subCategory, {
    fields: [qbank.subCategoryId],
    references: [subCategory.id],
  }),
  creator: one(user, {
    fields: [qbank.createdBy],
    references: [user.id],
  }),
  question: many(question),
}));

export const questionRelations = relations(question, ({ one, many }) => ({
  qbank: one(qbank, {
    fields: [question.qbankId],
    references: [qbank.id],
  }),
  creator: one(user, {
    fields: [question.createdBy],
    references: [user.id],
  }),
  microTopic: many(microTopic),
  // microTopic: one(microTopic, {
  //   fields: [question.microTopicId],
  //   references: [microTopic.id],
  // }),
}));
