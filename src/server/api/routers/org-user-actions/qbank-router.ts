import { subCategorySchema } from "@/lib/validation/category-schema";
import { createTRPCRouter, privateProcedure } from "../../trpc";
import { organisation } from "@/server/db/organisation";
import { and, eq, inArray } from "drizzle-orm";
import {
  category,
  qbank,
  qbankTestAttempt,
  subCategory,
} from "@/server/db/index-schema";
import { TRPCError } from "@trpc/server";
import * as schema from "@/server/db/index-schema";
import { slugify } from "@/lib/utils";
import z, { map } from "zod";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/session";
import { statusOfTheQuestionsBank } from "@/lib/validation/category-user/qbank";

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

      const categoryIds = categories.map((item) => item.id);

      const qbankAr = await ctx.db.query.qbank.findMany({
        where: and(inArray(qbank.categoryId, categoryIds)),
        with: {
          question: true,
        },
      });

      const mapCat = new Map<
        string,
        { id: string; name: string; questions: number }
      >();

      qbankAr.forEach((item) => {
        const existingCategory = mapCat.get(item.categoryId);
        const [{ name: categoryName }] = categories.filter(
          (catItem) => catItem.id === item.categoryId
        );
        if (existingCategory) {
          return mapCat.set(existingCategory.id, {
            id: item.categoryId,
            name: categoryName,
            questions: existingCategory.questions + item.question.length,
          });
        }
        return mapCat.set(item.categoryId, {
          id: item.categoryId,
          name: categoryName,
          questions: item.question.length,
        });
      });

      return [...mapCat.values()];
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
          inArray(category.id, input.categorySlug)
        ),
      });

      const categoryIds = categories.map((item) => item.id);

      const subCategoryItems = await ctx.db.query.subCategory.findMany({
        where: and(inArray(subCategory.categoryId, categoryIds)),
      });

      return subCategoryItems ?? [];
    }),
  getAllQuestionBankFromCategoryAndSubcategory: privateProcedure
    .input(
      z.object({
        categoryIds: z.array(z.string()),
        subCategoryIds: z.array(z.string()),
        organisationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.userRole !== "org_user") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const listOfQbanks = await ctx.db.query.qbank.findMany({
        where: and(
          eq(qbank.organisationId, input.organisationId),
          inArray(qbank.categoryId, input.categoryIds),
          inArray(qbank.subCategoryId, input.subCategoryIds)
        ),
      });

      return listOfQbanks ?? [];
    }),
  createTestAttempt: privateProcedure
    .input(
      z.object({
        numberOfQuestions: z.number().max(200),
        categoryIds: z.array(z.string().min(1)),
        subCategoryIds: z.array(z.string().min(1)),
        status: z.enum(statusOfTheQuestionsBank),
        organisationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await getCurrentUser();
        if (!session || !session.user || !session.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        if (ctx.userRole !== "org_user") {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const qBankList = await ctx.db.query.qbank.findMany({
          where: and(
            eq(qbank.organisationId, input.organisationId),
            inArray(qbank.categoryId, input.categoryIds),
            inArray(qbank.subCategoryId, input.subCategoryIds)
          ),
          with: {
            question: true,
          },
        });
        const listOfQuestions = qBankList
          .map((item) => item.question)
          .flat()
          .sort(() => Math.random() - 0.5);

        const selectedQuestions = listOfQuestions.slice(
          0,
          Math.min(input.numberOfQuestions, 200)
        );

        const nanoidValue = nanoid();

        const [testAttempt] = await ctx.db
          .insert(qbankTestAttempt)
          .values({
            id: nanoidValue,
            organisationId: input.organisationId,
            userId: session.user.id,
            filterStatus: input.status,
            qbankIds: qBankList.map((item) => item.id),
            questionIds: selectedQuestions.map((item) => item.id),
            status: "in_progress",
            totalQuestions: selectedQuestions.length,
            currentQuestionIndex: 0,
          })
          .returning();

        console.log(testAttempt);

        return { testAttempt, listOfQuestions };
      } catch (err) {
        console.log(err);
      }
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
