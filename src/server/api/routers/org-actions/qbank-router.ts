import {
  qBankSchema,
  QBankType,
  questionFormSchema,
} from "@/lib/validation/modules";
import { createTRPCRouter, orgProcedure, publicProcedure } from "../../trpc";
import z from "zod";
import {
  category,
  ListOfQuestionsType,
  organisation,
  qbank,
  question,
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
      const qbanks = await ctx.db.query.qbank.findMany({
        where: eq(qbank.organisationId, input.orgId),
        columns: {
          categoryId: true,
        },
        with: {
          category: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
      const result = Array.from(
        new Map(
          qbanks.map((q) => [
            q.category.id,
            {
              categoryId: q.category.id,
              categoryName: q.category.name,
              categorySlug: q.category.slug,
            },
          ])
        ).values()
      );
      return { success: true, items: result };
    }),

  getAllSubcategoriesFromCategorySlugAndOrgSlug: publicProcedure
    .input(
      z.object({
        orgSlug: z.string().min(1),
        categorySlug: z.string().min(1),
        orgId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const [categoryItem] = await ctx.db
        .select()
        .from(category)
        .where(
          and(
            eq(category.slug, input.categorySlug),
            eq(category.organisationId, input.orgId)
          )
        );

      const qbanks = await ctx.db.query.qbank.findMany({
        where: and(
          eq(qbank.organisationId, input.orgId),
          eq(qbank.categoryId, categoryItem.id)
        ),
        columns: {
          subCategoryId: true,
        },
        with: {
          subCategory: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      const result = Array.from(
        new Map(
          qbanks.map((q) => [
            q.subCategory.id,
            {
              subCategoryId: q.subCategory.id,
              subCategoryName: q.subCategory.name,
              subCategorySlug: q.subCategory.slug,
            },
          ])
        ).values()
      );

      return result ?? [];
    }),

  getAllQBankTitle: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().min(1),
        orgSlug: z.string().min(1),
        orgId: z.string().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      const [categoryItem] = await ctx.db
        .select({ id: category.id })
        .from(category)
        .where(
          and(
            eq(category.slug, input.categorySlug),
            eq(category.organisationId, input.orgId)
          )
        );

      const qBankTitle = await ctx.db.query.qbank.findMany({
        where: and(eq(qbank.categoryId, categoryItem.id)),
        columns: {
          name: true,
          id: true,
          totalQuestions: true,
        },
      });

      return qBankTitle ?? [];
    }),
  addQuestionsWithExplanations: orgProcedure
    .input(
      questionFormSchema.extend({
        qbankdId: z.string(),
        microTopicdId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await getCurrentUser();

        if (!session?.user || !session.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const existingQuestions = await ctx.db
          .select()
          .from(question)
          .where(eq(question.qbankId, input.qbankdId));

        const mappingExistingValues = new Map<string, ListOfQuestionsType>(
          existingQuestions.map((item) => [item.id, { ...item }])
        );
        const currentInputValues = new Map<string, ListOfQuestionsType>(
          input.questions.map((item) => [
            item.id,
            {
              id: item.id,
              questionText: item.questionText,
              options: item.options.map((q) => ({
                id: q.id || nanoid(),
                text: q.text,
                image: q.url || undefined,
                isCorrect: q.isCorrect,
              })),
              explanation: item.explanation,

              createdBy: session.user.id!,
              qbankId: input.qbankdId,
              microTopicId: input.microTopicdId,

              questionType: "multiple_choice" as QBankType,
              explanationImages: [],
              explanationVideos: [],
              images: [],
              videos: [],
              references: [],
              difficulty: "medium" as const,
              tags: [],
              timesAttempted: 0,
              timesCorrect: 0,
              avgTimeSpent: 0,
              status: "draft" as const,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              publishedAt: null,
            },
          ])
        );

        const result = new Map<string, ListOfQuestionsType>([
          ...mappingExistingValues,
          ...currentInputValues,
        ]);

        const questionsToInsert = Array.from(result.values());

        await ctx.db
          .delete(question)
          .where(eq(question.qbankId, input.qbankdId));

        const insertedQuestions = await ctx.db
          .insert(question)
          .values(questionsToInsert)
          .returning();
        await ctx.db
          .update(qbank)
          .set({ totalQuestions: insertedQuestions.length })
          .where(eq(qbank.id, input.qbankdId));
        return {
          success: true,
          // result: Array.from(result.values()),
          items: insertedQuestions,
          // count: insertedQuestions.length,
        };
      } catch (err) {
        console.log(err);
      }
    }),
  fetchAllQuestionsFromId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const questions = await ctx.db
        .select()
        .from(question)
        .where(eq(question.qbankId, input.id));

      return questions ?? [];
    }),
});

//example of innerjoin format
// const subCategoryList = await ctx.db
//   .select({
//     subCategoryId: subCategory.id,
//     subCategoryName: subCategory.name,
//     subCategorySlug: subCategory.slug,
//     category: category.name,
//   })
//   .from(subCategory)
//   .innerJoin(
//     category,
//     and(
//       eq(subCategory.categoryId, category.id),
//       eq(category.slug, input.categorySlug)
//     )
//   )
//   .innerJoin(organisation, and(eq(organisation.slug, input.orgSlug)));
