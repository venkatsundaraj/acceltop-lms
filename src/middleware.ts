// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("better-auth.session_token")?.value;

  if (token && req.nextUrl.pathname.startsWith("/super-admin/login")) {
    return NextResponse.redirect(new URL("/super-admin/dashboard", req.url));
  }

  if (!token && req.nextUrl.pathname.startsWith("/super-admin/dashboard")) {
    return NextResponse.redirect(new URL("/super-admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/dashboard/:path*", "/super-admin/login"],
};
