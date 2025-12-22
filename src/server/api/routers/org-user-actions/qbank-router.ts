import { subCategorySchema } from "@/lib/validation/category-schema";
import { createTRPCRouter, privateProcedure } from "../../trpc";
import { organisation } from "@/server/db/organisation";
import { and, eq } from "drizzle-orm";
import { category, subCategory } from "@/server/db/index-schema";
import { TRPCError } from "@trpc/server";
import { slugify } from "@/lib/utils";

export const orgUserQbankRouter = createTRPCRouter({
  getAllCategories: privateProcedure
    .input(subCategorySchema.omit({ title: true, categorySlug: true }))
    .query(async ({ ctx, input }) => {
      if (ctx.userRole !== "org_user") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
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
  getAllSubCategories: privateProcedure
    .input(subCategorySchema.omit({ title: true }))
    .query(async ({ ctx, input }) => {
      if (ctx.userRole !== "org_user") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
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
});
