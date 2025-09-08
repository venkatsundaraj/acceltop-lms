import { env } from "@/env";
import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, oAuthProxy } from "better-auth/plugins";
import { determineUserroleAndOrg, extractSignupSource } from "@/lib/auth-utils";
import * as schema from "@/server/db/schema";
import { eq } from "drizzle-orm";

let signupContextValue: string = "";

const getTrustedOrigins = () => {
  const origins = new Set<string>();
  const add = (v?: string) => v && origins.add(v);

  const toOrigin = (host?: string) =>
    host?.startsWith("http") ? host : host ? `https://${host}` : undefined;
  const toWWWOrigin = (host?: string) =>
    host?.startsWith("http") ? host : host ? `https://www.${host}` : undefined;

  add(env.BETTER_AUTH_URL);

  add(toOrigin(env.VERCEL_URL));
  add(toWWWOrigin(env.VERCEL_URL));

  add("http://localhost:3000"); // local dev
  add("http://localhost:3001"); // local dev

  return Array.from(origins);
};

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET!,
  trustedOrigins: getTrustedOrigins(),
  plugins:
    env.NODE_ENV === "production"
      ? [
          oAuthProxy({
            productionURL:
              "https://acceltop-lms.vercel.app/api/auth/callback/google", // Replace with your domain
            currentURL: env.BETTER_AUTH_URL,
          }),
        ]
      : [],
  database: drizzleAdapter(db, { provider: "pg" }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      redirectURI:
        env.NODE_ENV === "production"
          ? `${env.BETTER_AUTH_URL}/api/auth/callback/google`
          : "http://localhost:3000/api/auth/callback/google",
    },
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const session = ctx.context.newSession;

      let signupContext = ctx.request?.headers.get("referer");

      if (signupContext) {
        signupContextValue = signupContext;
      }

      if (ctx.context.newSession && ctx.context.newSession?.user.email) {
        const signupSource = extractSignupSource(signupContextValue);
        const { role, organizationId } = await determineUserroleAndOrg(
          ctx.context.newSession?.user.email,
          signupSource
        );

        //updating the existing schema
        const user = await db
          .update(schema.user)
          .set({
            userRole: role,
            organizationId: organizationId,
            userStatus: role === "admin" ? "active" : "pending",
            signupSource: signupSource,
          })
          .where(eq(schema.user.id, session?.user.id!))
          .returning();
        console.log("user", user);
      }
    }),
  },
});
