import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
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

    if (user.role?.toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin-dashboard",
    "/admin-dashboard/:path*",
  ],
};
