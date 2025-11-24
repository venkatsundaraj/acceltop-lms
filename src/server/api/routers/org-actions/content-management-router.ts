import z from "zod";
import { createTRPCRouter, orgProcedure } from "../../trpc";
import { slugify } from "@/lib/utils";
import { getCurrentUser } from "@/lib/session";
import {
  category,
  microTopic,
  organisation,
  subCategory,
} from "@/server/db/index-schema";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  categorySchema,
  microTopicSchema,
  subCategorySchema,
} from "@/lib/validation/category-schema";

export const contentMangementRouter = createTRPCRouter({
  addCategory: orgProcedure
    .input(categorySchema)
    .mutation(async ({ ctx, input }) => {
      const [orgId] = await ctx.db
        .select({ id: organisation.id })
        .from(organisation)
        .where(eq(organisation.id, input.organisationId));

      const nanoidValue = nanoid();
      const [newCategory] = await ctx.db
        .insert(category)
        .values({
          id: nanoidValue,
          slug: slugify(input.title),
          name: input.title,
          organisationId: orgId.id,
        })
        .returning();

      return newCategory ?? null;
    }),
  addSubCategory: orgProcedure
    .input(subCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const [categoryItem] = await ctx.db
        .select({ id: category.id })
        .from(category)
        .where(
          and(
            eq(category.slug, slugify(input.categorySlug)),
            eq(category.organisationId, input.organisationId)
          )
        );
      const nanoidValue = nanoid();
      const [newSubCategory] = await ctx.db
        .insert(subCategory)
        .values({
          id: nanoidValue,
          slug: slugify(input.title),
          name: input.title,
          categoryId: categoryItem.id,
        })
        .returning();

      return newSubCategory ?? null;
    }),
  addMicroTopic: orgProcedure
    .input(microTopicSchema.omit({ organisationId: true, categorySlug: true }))
    .mutation(async ({ ctx, input }) => {
      const [subCategoryItem] = await ctx.db
        .select({ id: subCategory.id })
        .from(subCategory)
        .where(and(eq(subCategory.id, input.subCategoryId)));
      console.log(subCategoryItem);
      const nanoidValue = nanoid();
      const [newMicroTopic] = await ctx.db
        .insert(microTopic)
        .values({
          id: nanoidValue,
          slug: slugify(input.title),
          name: input.title,
          subCategoryId: subCategoryItem.id,
        })
        .returning();

      return newMicroTopic ?? null;
    }),
  getAllCategories: orgProcedure
    .input(subCategorySchema.omit({ title: true, categorySlug: true }))
    .query(async ({ ctx, input }) => {
      const [orgId] = await ctx.db
        .select({ id: organisation.id })
        .from(organisation)
        .where(and(eq(organisation.id, input.organisationId)));
      const categories = await ctx.db
        .select()
        .from(category)
        .where(and(eq(category.organisationId, orgId.id)));

      return categories ?? [];
    }),
  getAllSubCategories: orgProcedure
    .input(subCategorySchema.omit({ title: true }))
    .query(async ({ ctx, input }) => {
      const [categoryItem] = await ctx.db
        .select({ id: category.id })
        .from(category)
        .where(
          and(
            eq(category.slug, slugify(input.categorySlug)),
            eq(category.organisationId, input.organisationId)
          )
        );

      const categories = await ctx.db
        .select()
        .from(subCategory)
        .where(and(eq(subCategory.categoryId, categoryItem.id)));
      return categories ?? [];
    }),
  getAllMicroTopics: orgProcedure
    .input(
      microTopicSchema.omit({
        title: true,
        categorySlug: true,
        organisationId: true,
      })
    )
    .query(async ({ ctx, input }) => {
      const [subCategoryItem] = await ctx.db
        .select({ id: subCategory.id })
        .from(subCategory)
        .where(and(eq(subCategory.id, input.subCategoryId)));

      const microTopics = await ctx.db
        .select()
        .from(microTopic)
        .where(and(eq(microTopic.subCategoryId, subCategoryItem.id)));
      return microTopics ?? [];
    }),
});
