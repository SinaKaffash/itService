import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { ADMIN_SESSION_COOKIE } from "./lib/auth/constants";
import { isValidAdminJwtForMiddleware } from "./lib/auth/edge-jwt";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const [locale, section, page] = segments;
  const isKnownLocale = locale === "fa" || locale === "en";
  const isProtectedAdminRoute =
    isKnownLocale && section === "admin" && page !== "login";

  if (
    isProtectedAdminRoute &&
    !(await isValidAdminJwtForMiddleware(
      request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? "",
    ))
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/admin/login`, request.url),
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
