import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./Lib/auth";

export async function middleware(req: NextRequest) {
  console.log("Middleware is running");
  const session = await auth();

  if (!session) {
    console.log("No session, redirecting to /login");
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const { role } = session.user;
  const url = req.nextUrl.pathname;

  if (url.startsWith("/admin") && role !== "admin") {
    console.log("User is not admin, redirecting to /");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
