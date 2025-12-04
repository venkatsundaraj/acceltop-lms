import { qBankSchema } from "@/lib/validation/modules";
import { createTRPCRouter, orgProcedure, publicProcedure } from "../../trpc";
import z from "zod";
import {
  category,
  organisation,
  qbank,
  subCategory,
} from "@/server/db/index-schema";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/session";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const orgQBankRouter = createTRPCRouter({
  addQbankTitle: orgProcedure
    .input(
      qBankSchema.extend({
        orgId: z.string().min(1),
        categoryItem: z.string().min(1),
        subCategoryItem: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const session = await getCurrentUser();
      if (!session || !session.user || !session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const [qbankItem] = await ctx.db
        .insert(qbank)
        .values({
          id: nanoid(),
          categoryId: input.categoryItem,
          subCategoryId: input.subCategoryItem,
          name: input.title,
          organisationId: input.orgId,
          createdBy: session.user.id,
        })
        .returning();
      return { success: true, item: qbankItem };
    }),
  getAllQbankDetails: publicProcedure
    .input(z.object({ orgId: z.string() }))
    .query(async ({ ctx, input }) => {
      const categoryIds = await ctx.db
        .selectDistinct({
          categoryId: qbank.categoryId,
          categoryName: category.name,
          categorySlug: category.slug,
        })
        .from(qbank)
        .innerJoin(category, eq(qbank.categoryId, category.id))
        .where(eq(qbank.organisationId, input.orgId));

      return { success: true, items: categoryIds };
    }),

  getAllSubcategoriesFromCategorySlugAndOrgSlug: publicProcedure
    .input(
      z.object({ orgSlug: z.string().min(1), categorySlug: z.string().min(1) })
    )
    .query(async ({ ctx, input }) => {
      const subCategoryList = await ctx.db
        .select({
          subCategoryId: subCategory.id,
          subCategoryName: subCategory.name,
          subCategorySlug: subCategory.slug,
          category: category.name,
        })
        .from(subCategory)
        .innerJoin(
          category,
          and(
            eq(subCategory.categoryId, category.id),
            eq(category.slug, input.categorySlug)
          )
        )
        .innerJoin(organisation, and(eq(organisation.slug, input.orgSlug)));

      return subCategoryList ?? [];
    }),

  getAllQBankTitle: publicProcedure
    .input(
      z.object({ categorySlug: z.string().min(1), orgSlug: z.string().min(1) })
    )
    .query(async ({ input, ctx }) => {
      const qbankTitle = await ctx.db
        .select({ qbankTitle: qbank.name })
        .from(qbank)
        .innerJoin(
          category,
          and(
            eq(qbank.categoryId, category.id),
            eq(category.slug, input.categorySlug)
          )
        )
        .innerJoin(organisation, and(eq(organisation.slug, input.orgSlug)));
      console.log(qbankTitle);
      return qbankTitle ?? [];
    }),
});
