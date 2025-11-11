import { env } from "@/env";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

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

  const checkIfOrgUser = await db
    .select()
    .from(schema.user)
    .where(
      and(eq(schema.user.email, email), eq(schema.user.userRole, "org_user"))
    );
  console.log(checkIfOrgUser);

  if (checkIfOrgUser.length) {
    return { role: "org_user", organizationId: null };
  }

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
