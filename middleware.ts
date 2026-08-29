import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public route patterns that do not require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/design-system",
  "/login(.*)",
  "/signup(.*)",
  "/forgot-password(.*)",
  "/invite(.*)",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icon.svg",
  "/brand/(.*)",
  "/icons/(.*)",
  "/sw.js",
  "/workbox-(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Fail-Closed Security Policy: Enforce authentication on all routes by default
  // unless explicitly included in the public allowlist
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  const response = NextResponse.next();

  // Attach defense-in-depth HTTP security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
