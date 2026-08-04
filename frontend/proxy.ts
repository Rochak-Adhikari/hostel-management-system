import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// path prefix -> role that is allowed to see it
const ROLE_BY_PREFIX = {
  "/admin": "admin",
  "/guardian": "guardian",
  "/student": "student",
} as const;

// role -> tesko aafno dashboard
const DASHBOARD_BY_ROLE: Record<string, string> = {
  admin: "/admin/dashboard",
  guardian: "/guardian/dashboard",
  student: "/student/dashboard",
};

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set — route protection cannot verify tokens");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

function redirectAndClear(request: NextRequest, to: string) {
  const response = NextResponse.redirect(new URL(to, request.url));
  response.cookies.delete("accessToken");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const entry = Object.entries(ROLE_BY_PREFIX).find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // matcher should prevent this, but bail out rather than guess
  if (!entry) return NextResponse.next();

  const requiredRole = entry[1];
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let role: string | undefined;
  try {
    // jwtVerify checks signature AND exp
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    role = typeof payload.role === "string" ? payload.role : undefined;
  } catch {
    return redirectAndClear(request, "/login");
  }

  if (role !== requiredRole) {
    // session valid nai cha - cookie clear gardaina, aafno dashboard ma pathaune.
    // role unknown vaye matra landing page (data corrupt/purano token)
    const home = role ? DASHBOARD_BY_ROLE[role] : undefined;
    return NextResponse.redirect(new URL(home ?? "/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/guardian/:path*", "/student/:path*"],
};
