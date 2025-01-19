import {
  publicRoutes,
  authApiPrefix,
  authRoutesPrefixes,
  redirectUrl,
} from "@/constants";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth({ providers: [] });

export default auth((request) => {
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith(authApiPrefix);
  const isPublicRoute = publicRoutes.includes(pathname);
  if (isPublicRoute || isApiRoute) {
    return NextResponse.next();
  }

  const isLoggedIn = !!request.auth;
  const isAuthRoute = authRoutesPrefixes.some((route) =>
    pathname.startsWith(route)
  );
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(`${redirectUrl}`, request.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL(`/sign-in`, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|avif|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|favicon.ico|sitemap.xml|robots.txt)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
