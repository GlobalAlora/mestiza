import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Web Crypto HMAC-SHA256 — works in the Edge runtime.
// Must produce the same output as adminToken() in app/admin/_lib.ts.
async function computeAdminToken(password: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET ?? 'mestiza-admin-2025';
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(password));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const CUSTOMER_AUTH_EXCLUDED = [
  '/mi-cuenta/login',
  '/mi-cuenta/registrarse',
  '/mi-cuenta/olvide-contrasena',
  '/mi-cuenta/reset-password',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Forward the pathname as a request header so server components can read it.
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set('x-pathname', pathname);
  const passThrough = NextResponse.next({ request: { headers: reqHeaders } });

  // ── Admin routes ──────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    // Login page must always be reachable.
    if (pathname === '/admin/login') return passThrough;

    // Disable admin entirely when ADMIN_PASSWORD is not configured.
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      return new NextResponse(null, { status: 404 });
    }

    // Validate the HMAC session cookie.
    const cookieToken = request.cookies.get('admin-auth')?.value;
    const expected = await computeAdminToken(password);
    if (cookieToken !== expected) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return passThrough;
  }

  // ── Customer account routes ───────────────────────────────────────────────
  if (
    pathname.startsWith('/mi-cuenta') &&
    !CUSTOMER_AUTH_EXCLUDED.some((p) => pathname.startsWith(p))
  ) {
    const hasAuthCookie = request.cookies
      .getAll()
      .some((c) => c.name.startsWith('sb-') && c.name.includes('auth'));
    if (!hasAuthCookie) {
      const loginUrl = new URL('/mi-cuenta/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return passThrough;
}

export const config = {
  matcher: ['/admin/:path*', '/mi-cuenta/:path*'],
};
