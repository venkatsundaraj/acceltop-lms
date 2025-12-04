import { orgValidation } from "@/lib/validation/org-schema";
import {
  createTRPCRouter,
  orgProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import * as schema from "@/server/db/index-schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { nanoid } from "nanoid";
import { getCurrentUser } from "@/lib/session";

export const orgRouter = createTRPCRouter({
  getOrg: publicProcedure.query(async ({ ctx }) => {
    const session = await getCurrentUser();
    if (
      !session ||
      !session.user ||
      !session.user.id ||
      session.user.userRole !== "org"
    ) {
      return null;
    }

    if (session.user.organizationId) {
      const [org] = await ctx.db
        .select()
        .from(schema.organisation)
        .where(eq(schema.organisation.id, session.user.organizationId));

      return org ?? null;
    }

    return null;
  }),
  getOrgFromEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await getCurrentUser();
      if (!session || !session.user || !session.user.id) {
        return null;
      }

      if (session.user.organizationId) {
        const [org] = await ctx.db
          .select()
          .from(schema.user)
          .where(eq(schema.user.email, input.email));

        return org ?? null;
      }

      return null;
    }),
  getOrgBySlug: publicProcedure
    .input(z.object({ orgSlug: z.string().trim().min(1) }))
    .query(async ({ ctx, input }) => {
      const org = await ctx.db
        .select()
        .from(schema.organisation)
        .where(eq(schema.organisation.slug, input.orgSlug));

      if (!org.length) {
        return {
          uniqueOrg: null,
        };
      }

      const [uniqueOrg] = org;

      return {
        uniqueOrg,
      };
    }),

  findOrgById: orgProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const org = await ctx.db
      .select()
      .from(schema.organisation)
      .where(eq(schema.organisation.id, input));

    return org[0] ?? null;
  }),
  checkSlugAvailability: publicProcedure
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

  createOrganisation: publicProcedure
    .input(orgValidation)
    .mutation(async ({ ctx, input }) => {
      const session = await getCurrentUser();
      if (!session || !session.user || !session.user.id) {
        return null;
      }
      const existingOrg = await ctx.db
        .select()
        .from(schema.organisation)
        .where(eq(schema.organisation.slug, input.slug));

      if (existingOrg.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already has an organization",
        });
      }

      const nanoidValue = nanoid();

      const [newOrg] = await ctx.db
        .insert(schema.organisation)
        .values({
          id: nanoidValue,
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

      const user = await ctx.db
        .update(schema.user)
        .set({
          organizationId: newOrg.id,
          userStatus: "active",
        })
        .where(eq(schema.user.id, session.user.id));

      return {
        user,
        newOrg,
        success: true,
        redirect: `/org/${newOrg.slug}/app`,
      };
    }),
});
