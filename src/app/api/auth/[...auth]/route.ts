import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// This adapts Better Auth for Next.js App Router
export const { GET, POST } = toNextJsHandler(auth);
