import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";

export type TRPCResult<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
    needsRedirect?: string;
  };
};

export async function handleTRPCCall<T>(
  trpcCall: () => Promise<T>
): Promise<TRPCResult<T>> {
  try {
    const data = await trpcCall();
    return { data };
  } catch (error) {
    console.error("TRPC Error:", error);

    if (error instanceof TRPCError) {
      let needsRedirect: string | undefined;

      switch (error.code) {
        case "UNAUTHORIZED":
          needsRedirect = "/org/login";
          break;
        case "FORBIDDEN":
          needsRedirect = "/org/login";
          break;
      }

      return {
        error: {
          code: error.code,
          message: error.message,
          needsRedirect,
        },
      };
    }

    return {
      error: {
        code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred",
      },
    };
  }
}
