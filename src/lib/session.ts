import { authClient, useSession } from "@/lib/auth-client";
import { auth } from "./auth";
import { headers } from "next/headers";

export const getCurrentUser = async function () {
  try {
    const data = await auth.api.getSession({
      headers: await headers(),
    });
    console.log("data + user", data?.user);
    return data;
  } catch (err) {
    console.log(err);
  }
};
