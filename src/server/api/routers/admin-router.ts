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

const value: string[] = ["hello", "one"];

export const adminRouter = createTRPCRouter({
  getAdmin: adminProcedure.query(async ({ ctx, input }) => {
    return ctx;
  }),
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await db.select().from(schema.user);
    console.log(users);
    return users;
  }),
  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    return value;
  }),
  uploadPost: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      const post = value.push(input.text);
      console.log(value);
      return value;
    }),
});
