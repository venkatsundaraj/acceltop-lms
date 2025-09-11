import { orgValidation } from "@/lib/validation/org-schema";
import { createTRPCRouter, orgProcedure } from "@/server/api/trpc";
import * as schema from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { nanoid } from "nanoid";

export const orgRouter = createTRPCRouter({
  getOrg: orgProcedure.query(({ ctx }) => {
    return ctx;
  }),
  findOrgById: orgProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const org = await ctx.db
      .select()
      .from(schema.organisation)
      .where(eq(schema.organisation.id, input));

    return org;
  }),
  checkSlugAvailability: orgProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const ifSlugExists = await ctx.db
        .select()
        .from(schema.organisation)
        .where(eq(schema.organisation.slug, input.slug));
      return {
        available: ifSlugExists,
      };
    }),
  createOrganisation: orgProcedure
    .input(orgValidation)
    .mutation(async ({ ctx, input }) => {
      console.log(ctx, ctx.organizationId, Boolean(ctx.organizationId));
      if (ctx.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already has an organization",
        });
      }

      const existingOrg = await ctx.db
        .select()
        .from(schema.organisation)
        .where(eq(schema.organisation.slug, input.slug));
      console.log(existingOrg, Boolean(existingOrg));
      if (existingOrg.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already has an organization",
        });
      }
      const nanoId = nanoid();
      const [newOrg] = await ctx.db
        .insert(schema.organisation)
        .values({
          id: String(nanoId),
          name: input.name,
          slug: input.slug,
          contactEmail: input.contactEmail,
          phone: input.phone,
          website: input.website,
          focusExams: input.focusExams,
          organisationType: input.organizationType,
          description: input.description,
          isPublic: true,
          isSetupCompleted: true,
          status: "active",
          settings: {
            onBoardingStep: 3,
            features: ["mock_tests", "question_bank"],
          },
        })
        .returning();

      console.log(newOrg);

      const user = await ctx.db.update(schema.user).set({
        organizationId: newOrg.id,
        userStatus: "active",
      });

      return {
        user,
        newOrg,
        success: true,
        redirect: `/org/${newOrg.slug}/dashboard`,
      };
    }),
});
