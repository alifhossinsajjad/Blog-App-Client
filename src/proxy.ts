import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip auth routes (login, register, verify-email) and static assets
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  try {
    const cookieString = request.headers.get("cookie") || "";

    // Fetch session directly to avoid importing Node.js specific code in Edge Runtime
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/get-session`, {
      headers: {
        ...(cookieString ? { Cookie: cookieString } : {}),
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const data = await res.json();
    const user = data?.user;

    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Role-based guard for admin routes
    if (pathname.startsWith("/admin-dashboard") && user.role?.toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
