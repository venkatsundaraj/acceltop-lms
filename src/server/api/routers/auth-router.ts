import z from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import * as schema from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const authRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getOrganisation: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const org = await ctx.db
        .select()
        .from(schema.organisation)
        .where(eq(schema.organisation.id, input));

      return org[0] ?? null;
    }),
});
