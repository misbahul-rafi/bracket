import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuth = !!token;

  const protectedRoutes = ["/profiles"];
  const isProtected = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !isAuth) {
    const loginUrl = new URL("/signin", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profiles/:path*',
    '/leagues/:slug/manage/:path*',
    '/leagues/:slug/manage',
  ],
};
