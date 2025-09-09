import { authClient } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/session";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

export const adminRouter = createTRPCRouter({
  getAdmin: adminProcedure.query(async ({ ctx, input }) => {
    return ctx;
  }),
});
