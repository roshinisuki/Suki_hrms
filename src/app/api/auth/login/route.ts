/**
 * POST /api/auth/login
 * Body: { username: string, password: string, role?: "admin" | "viewer" }
 * Returns: { token: string, role: string } if credentials valid
 *
 * NOTE: This is a skeleton. For now, it accepts any username/password.
 * The `role` param selects which role to assume for testing RBAC.
 * Real authentication (against an Employee/User table) is out of scope.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signTokenNode } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password, role: requestedRole } = body;

  if (!username || !password) {
    return NextResponse.json(
      { error: 'username and password are required' },
      { status: 400 }
    );
  }

  const roleCode = requestedRole === 'viewer' ? 'viewer' : 'admin';

  // Find or create the requested role
  const role = await prisma.role.upsert({
    where: { code: roleCode },
    update: {},
    create: {
      code: roleCode,
      name: roleCode === 'admin' ? 'Administrator' : 'View-Only Tester',
      description: roleCode === 'admin'
        ? 'Full access to all master tables'
        : 'View access to all master tables, no edit',
    },
  });

  // Issue JWT (jsonwebtoken — Node runtime)
  const token = signTokenNode({
    userId: 1, // skeleton — no User table yet
    roleId: role.id,
    roleCode: role.code,
  });

  return NextResponse.json({ token, role: role.code });
}
