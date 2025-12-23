import { subCategorySchema } from "@/lib/validation/category-schema";
import { createTRPCRouter, privateProcedure } from "../../trpc";
import { organisation } from "@/server/db/organisation";
import { and, eq, inArray } from "drizzle-orm";
import { category, subCategory } from "@/server/db/index-schema";
import { TRPCError } from "@trpc/server";
import { slugify } from "@/lib/utils";
import z from "zod";

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
    .input(
      z.object({
        categorySlug: z.array(z.string()),
        organisationId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.userRole !== "org_user") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      if (input.categorySlug.length === 0) {
        return [];
      }
      const categories = await ctx.db.query.category.findMany({
        where: and(
          eq(category.organisationId, input.organisationId),
          inArray(category.slug, input.categorySlug)
        ),
      });

      const categoryIds = categories.map((item) => item.id);

      const subCategoryItems = await ctx.db.query.subCategory.findMany({
        where: and(inArray(subCategory.categoryId, categoryIds)),
      });

      return subCategoryItems ?? [];
    }),
});

// const [categoryItem] = await ctx.db
//   .select({ id: category.id })
//   .from(category)
//   .where(
//     and(
//       eq(category.slug, slugify(input.categorySlug)),
//       eq(category.organisationId, input.organisationId)
//     )
//   );

// const categories = await ctx.db
//   .select()
//   .from(subCategory)
//   .where(and(eq(subCategory.categoryId, categoryItem.id)));
// return categories ?? [];
