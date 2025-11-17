import z from "zod";
import { createTRPCRouter, orgProcedure } from "../../trpc";
import { slugify } from "@/lib/utils";
import { getCurrentUser } from "@/lib/session";
import { category } from "@/server/db/index-schema";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const contentMangementRouter = createTRPCRouter({
  addCategory: orgProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const session = await getCurrentUser();
      if (!session?.user || !session.user.organizationId) {
        return null;
      }
      const nanoidValue = nanoid();
      const [newCategory] = await ctx.db
        .insert(category)
        .values({
          id: nanoidValue,
          slug: slugify(input.text),
          name: input.text,
          organisationId: session.user.organizationId,
        })
        .returning();

      return newCategory;
    }),
  getAllCategories: orgProcedure.query(async ({ ctx }) => {
    const session = await getCurrentUser();
    if (!session?.user || !session.user.organizationId) {
      return null;
    }
    const categories = await ctx.db
      .select()
      .from(category)
      .where(and(eq(category.organisationId, session.user.organizationId)));

    return categories;
  }),
});
