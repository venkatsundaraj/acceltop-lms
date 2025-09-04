import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
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
