import { env } from "@/env";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { eq } from "drizzle-orm";

let existedRoute: string;
export const getSignupContext = function (referer: string | null | undefined) {
  if (referer) {
    existedRoute = referer;
  }
  return existedRoute;
};

export const extractSignupSource = function (path: string): string {
  if (path.includes("/super-admin/login")) {
    return "admin";
  }

  if (path.includes("/org/") && path.includes("/student/login")) {
    const orgMatch = path.match(/\/org\/([^\/]+)\/student/);
    return orgMatch ? `student_${orgMatch[1]}` : "student";
  }

  if (path.includes("/org/login")) {
    return "org";
  }
  return "direct";
};

export const determineUserroleAndOrg = async function (
  email: string,
  signupSource: string
): Promise<{
  role: "admin" | "org" | "org_user";
  organizationId: string | null;
}> {
  const adminEmails = env.ADMIN_EMAIL.split(",") || [];

  if (adminEmails.includes(email)) {
    return { role: "admin", organizationId: null };
  }

  // if (signupSource === "admin" && !adminEmails.includes(email)) {
  //   throw new Error("Unauthorized");
  // }
  // if (signupSource === "org") {
  //   return { role: "org", organizationId: null };
  // }
  // if (signupSource.startsWith("student_")) {
  //   const slug = signupSource.replace("student_", "");

  //   const org = await db
  //     .select()
  //     .from(schema.organisation)
  //     .where(eq(schema.organisation.slug, slug));

  //   if (org.length > 0) {
  //     // organisation id for the user
  //     return { role: "org_user", organizationId: org[0].id };
  //   }
  // }
  return { role: "org", organizationId: null };
};

export const getUserWithRole = async function (userId: string) {
  try {
    const [user] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId));
    if (!user || !user.id) {
      throw new Error("Something went wrong");
    }
    return user;
  } catch (err) {
    console.log(err);
  }
};
