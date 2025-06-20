import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const protectedRoutes = [
    '/leagues/new',
    '/teams/new',
    '/leagues/:slug/manage',
    '/profiles'
  ];

  const isProtectedRoute = protectedRoutes.some(route => {
    const regex = new RegExp(`^${route.replace(':slug', '[^/]+')}(/.*)?$`);
    return regex.test(pathname);
  });

  if (isProtectedRoute && !token) {
    const signInUrl = new URL('/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (pathname.includes('/manage')) {
    if (!token) {
      const signInUrl = new URL('/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(signInUrl);
    }

    const slug = pathname.split('/')[2];
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/leagues/${slug}/verify-owner`, {
        headers: {
          // Forward semua cookie dari request awal ke internal API
          cookie: req.headers.get("cookie") || ""
        }
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      console.log(error)
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profiles/:path*',
    '/teams/new',
    '/leagues/new',
    '/leagues/:slug/manage/:path*',
    '/leagues/:slug/manage'
  ],
};