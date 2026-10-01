import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "./lib/auth/constants";
import { isValidAdminJwtForMiddleware } from "./lib/auth/edge-jwt";

export default async function middleware(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const [section, page] = segments;
  const isProtectedAdminRoute = section === "admin" && page !== "login";

  if (
    isProtectedAdminRoute &&
    !(await isValidAdminJwtForMiddleware(
      request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? "",
    ))
  ) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
