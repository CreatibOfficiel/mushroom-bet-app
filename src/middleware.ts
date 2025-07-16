import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/me', '/races', '/bets'];

  // Check if the current path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const accessToken = request.cookies.get('accessToken');

    if (!accessToken) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Optionally, you can add token validation here by calling your backend
    // For now, we'll assume the presence of a token means authenticated.
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/validate-token`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
        },
      });

      if (!response.ok) {
        // Token invalid or expired, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Error validating token in middleware:', error);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/me/:path*', '/races/:path*', '/bets/:path*'],
};
