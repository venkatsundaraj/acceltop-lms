import { getCurrentUser } from "@/lib/session";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "@/server/api/trpc";

import { eq } from "drizzle-orm";

import { studentSubscription } from "@/server/db/organisation-user";
import z from "zod";
import { organisation } from "@/server/db/organisation";
import { nanoid } from "nanoid";
import { user } from "@/server/db/schema";

export const orgUserRouter = createTRPCRouter({
  getOrgUser: publicProcedure.query(async ({ ctx }) => {
    const session = await getCurrentUser();
    if (
      !session ||
      !session.user ||
      !session.user.id ||
      session.user.userRole !== "org_user"
    ) {
      return null;
    }

    const [orgUser] = await ctx.db
      .select()
      .from(studentSubscription)
      .where(eq(studentSubscription.studentId, session.user.id));
    console.log("user", orgUser);
    return orgUser ?? null;
  }),
  createOrgUser: privateProcedure
    .input(z.object({ orgId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const session = await getCurrentUser();
      const [org] = await ctx.db
        .select({ id: organisation.id })
        .from(organisation)
        .where(eq(organisation.id, input.orgId));

      if (!org.id) {
        throw new Error("Please login from the correct organisation");
      }

      if (!session || !session.user || !session.user.id) {
        throw new Error("Please login from the correct organisation");
      }

      const updatedUser = await ctx.db
        .update(user)
        .set({ userRole: "org_user" })
        .where(eq(user.id, session.user.id))
        .returning();

      const nanoidValue = nanoid();
      const date = new Date();
      const orgUser = await ctx.db
        .insert(studentSubscription)
        .values({
          id: nanoidValue,
          organisationId: org.id,
          studentId: session?.user.id,
          subscriptionPlan: "basic",
          status: "trial",
          startDate: date,
          endDate: date,
        })
        .returning();

      return orgUser;
    }),
});
