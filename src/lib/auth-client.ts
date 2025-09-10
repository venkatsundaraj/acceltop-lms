import { env } from "@/env";
import { customSessionClient } from "better-auth/client/plugins";
import { auth } from "./auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [customSessionClient<typeof auth>()],
  fetchOptions: {
    onError: (e) => {
      console.log("Auth client error:", e.response, e.request);
    },

    onSuccess: (data) => {
      console.log("Auth success:", data);
    },
  },
});

// Export hooks for easy use
export const { signIn, signUp, signOut, useSession } = authClient;
