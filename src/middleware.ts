import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // Get the JWT token from cookies

  // Define protected routes that require authentication
  const protectedRoutes = ["/home", "/dashboard",'/transactions'];

  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    // If the user is not authenticated, redirect to login
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next(); // Continue to the requested page
}

// Define routes where this middleware should run
export const config = {
  matcher: ["/home", "/dashboard",'/transactions','/'], // Protect these pages
};
