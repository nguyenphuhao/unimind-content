import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths, API routes, static files, admin routes, and root
  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/keystatic") ||
    pathname.startsWith("/adminx") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if path already has a locale prefix
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return NextResponse.next();
  }

  // Redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|keystatic|adminx|.*\\..*).*)"],
};
