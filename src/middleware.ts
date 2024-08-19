import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./Lib/auth";

export async function middleware(req: NextRequest) {
  console.log("Middleware is running");

  const session = await auth();
  const url = req.nextUrl.pathname;

  if (session) {
    console.log("Session exists:", session);

    if (url === "/sign-in" || url === "/sign-up") {
      console.log("Authenticated user trying to access sign-in/sign-up, redirecting to home");
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    console.log("No session detected, redirecting to /sign-in");

    if (url.startsWith("/admin") || url.startsWith("/user")) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  if (url.startsWith("/admin") && session?.user.role !== "admin") {
    console.log("User is not admin, redirecting to /");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/sign-in", "/sign-up"],
};
