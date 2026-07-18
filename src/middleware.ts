/**
 * Next.js Edge middleware — JWT verification + RBAC route protection.
 *
 * Uses jose (Edge-compatible) for token verification.
 * Routes under /api/protected/* require a valid JWT + specific permission.
 *
 * Permission mapping is defined in PROTECTED_ROUTES below.
 * To add more protected routes, add entries there — do NOT extend beyond
 * the test route until Checkpoint 3 is approved.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifyTokenJose } from '@/lib/jwt';

interface RoutePermission {
  pattern: string;
  method: string;
  permission: {
    module: string;
    submodule?: string;
    page?: string;
    action: string;
  };
}

// Only the test route is protected for now (Checkpoint 3 scope)
const PROTECTED_ROUTES: RoutePermission[] = [
  {
    pattern: '/api/protected/test',
    method: 'GET',
    permission: {
      module: 'system',
      submodule: 'test',
      page: 'demo',
      action: 'view',
    },
  },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // Find matching protected route
  const route = PROTECTED_ROUTES.find(
    (r) => pathname === r.pattern && method === r.method
  );

  if (!route) {
    return NextResponse.next();
  }

  // Extract token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);

  // Verify token (jose — Edge compatible)
  const payload = await verifyTokenJose(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Add user info to request headers for downstream route handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', String(payload.userId));
  requestHeaders.set('x-role-id', String(payload.roleId));
  requestHeaders.set('x-role-code', payload.roleCode);

  // Note: Permission DB check happens in the route handler (Node runtime),
  // not in middleware (Edge runtime can't access Prisma).
  // Middleware only verifies the token is valid.

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/api/protected/:path*'],
};
