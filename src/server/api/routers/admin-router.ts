import { authClient } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/session";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

export const adminRouter = createTRPCRouter({
  // getAdmin: adminProcedure.query(async ({ ctx, input }) => {
  //   return ctx;
  // }),
  // checkAuthStatus: publicProcedure.query(async ({ ctx }) => {
  //   const data = await getCurrentUser();
  //   const user = await data?.user;
  //   if (!user?.id) {
  //     return {
  //       isAuthenticated: false,
  //       isAdmin: false,
  //       user: null,
  //     };
  //   }
  //   const [dbUser] = await db
  //     .select()
  //     .from(schema.user)
  //     .where(eq(schema.user.id, user.id));
  //   if (!dbUser) {
  //     return {
  //       isAuthenticated: true,
  //       isAdmin: false,
  //       user: user,
  //     };
  //   }
  //   return {
  //     isAuthenticated: true,
  //     isAdmin: dbUser.userRole === "admin",
  //     user: dbUser,
  //   };
  // }),
});
