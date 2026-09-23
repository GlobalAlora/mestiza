import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * First-line protection for /admin routes.
 * Checks for the presence of any Supabase auth cookie.
 * Full auth + role validation happens in app/admin/layout.tsx (server component).
 *
 * Note: In Next.js 16, this file replaces middleware.ts.
 */
const CUSTOMER_AUTH_EXCLUDED = [
  '/mi-cuenta/login',
  '/mi-cuenta/registrarse',
  '/mi-cuenta/olvide-contrasena',
  '/mi-cuenta/reset-password',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasAuthCookie = () =>
    request.cookies.getAll().some((c) => c.name.startsWith('sb-') && c.name.includes('auth'));

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!hasAuthCookie()) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (
    pathname.startsWith('/mi-cuenta') &&
    !CUSTOMER_AUTH_EXCLUDED.some((p) => pathname.startsWith(p))
  ) {
    if (!hasAuthCookie()) {
      const loginUrl = new URL('/mi-cuenta/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/mi-cuenta/:path*'],
};
