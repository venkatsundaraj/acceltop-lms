import { env } from "@/env";
import {
  determineUserroleAndOrg,
  extractSignupSource,
  getSignupContext,
  getUserWithRole,
} from "@/lib/auth-utils";
import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import * as schema from "@/server/db/schema";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  createAuthMiddleware,
  customSession,
  oAuthProxy,
} from "better-auth/plugins";
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
            const userData = await getUserWithRole(user.id);
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

      let signupContext = ctx.request?.headers.get("referer");
      const pathValue = getSignupContext(signupContext);

      if (ctx.context.newSession && ctx.context.newSession?.user.email) {
        const signupSource = extractSignupSource(pathValue);
        const { role, organizationId } = await determineUserroleAndOrg(
          ctx.context.newSession?.user.email,
          signupSource
        );
        //updating the existing schema

        const [user] = await db
          .update(schema.user)
          .set({
            userRole: role,
            organizationId: organizationId,
            userStatus: role === "admin" ? "active" : "pending",
            signupSource: role,
          })
          .where(eq(schema.user.id, session?.user.id!))
          .returning();

        if (user.userRole === "admin") {
          console.log("admin redirection");
          return ctx.redirect("/super-admin/dashboard");
        }

        if (user.userRole === "org") {
          console.log("org redirection");
          return ctx.redirect("/org/onboarding");
        }
      }

      if (
        !session ||
        !session.user ||
        !env.ADMIN_EMAIL.includes(session.user.email)
      ) {
        console.log("final redirection");
        ctx.redirect("/org/login");
      }
    }),
  },
});
