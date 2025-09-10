import { env } from "@/env";
import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  createAuthMiddleware,
  customSession,
  oAuthProxy,
  role,
} from "better-auth/plugins";
import { extractSignupSource, getUserWithRole } from "@/lib/auth-utils";
import * as schema from "@/server/db/schema";
import { eq } from "drizzle-orm";

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
          customSession(async ({ user, session }) => {
            const userData = getUserWithRole(user.id);
            return {
              user: {
                ...userData,
              },
              session,
            };
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
  user: {
    additionalFields: {
      userRole: {
        type: "string",
        required: false,
      },
      organizationId: {
        type: "string",
        required: false,
      },
      userStatus: {
        type: "string",
        required: false,
      },
      signupSource: {
        type: "string",
        required: false,
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const session = ctx.context.newSession;
      console.log(session);
      if (session) {
        ctx.redirect("/super-admin/dashboard");
      } else {
        ctx.redirect("/super-admin/login");
      }
    }),
  },
});
