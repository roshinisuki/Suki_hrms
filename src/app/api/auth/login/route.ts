/**
 * POST /api/auth/login
 * Body: { username: string, password: string }
 * Returns: { token: string } if credentials valid
 *
 * NOTE: This is a skeleton. For now, it accepts any username/password
 * and creates/looks up a Role called "admin" with all permissions.
 * Real authentication (against an Employee/User table) is out of scope
 * for this branch — that's a future task.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signTokenNode } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { error: 'username and password are required' },
      { status: 400 }
    );
  }

  // SKELETON: No User table yet. Accept any credentials.
  // Create or find an "admin" role for the demo.
  const role = await prisma.role.upsert({
    where: { code: 'admin' },
    update: {},
    create: {
      code: 'admin',
      name: 'Administrator',
      description: 'Skeleton admin role for RBAC demo',
    },
  });

  // Create or find the test permission
  const permission = await prisma.permission.upsert({
    where: { code: 'system.test.demo.view' },
    update: {},
    create: {
      code: 'system.test.demo.view',
      module: 'system',
      submodule: 'test',
      page: 'demo',
      action: 'view',
      description: 'Test permission for RBAC skeleton demo',
    },
  });

  // Grant the permission to the role if not already
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: { roleId: role.id, permissionId: permission.id },
    },
    update: {},
    create: {
      roleId: role.id,
      permissionId: permission.id,
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
