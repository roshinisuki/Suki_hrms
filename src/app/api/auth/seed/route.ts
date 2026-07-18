/**
 * POST /api/auth/seed
 *
 * One-time seed endpoint that creates:
 * - 12 master permission entries (6 groups × 2 actions)
 * - 1 existing test permission (preserved)
 * - "admin" role with all permissions
 * - "viewer" role with view-only permissions
 *
 * Safe to call multiple times — uses upsert.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PermDef {
  code: string;
  module: string;
  submodule: string;
  page: string;
  action: string;
  description: string;
}

const MASTER_PERMISSIONS: PermDef[] = [
  // Org group
  { code: 'masters.org.view', module: 'masters', submodule: 'org', page: '*', action: 'view', description: 'View organizational master tables' },
  { code: 'masters.org.edit', module: 'masters', submodule: 'org', page: '*', action: 'edit', description: 'Create/edit/delete organizational master tables' },
  // Statutory group
  { code: 'masters.statutory.view', module: 'masters', submodule: 'statutory', page: '*', action: 'view', description: 'View statutory slab/rate tables' },
  { code: 'masters.statutory.edit', module: 'masters', submodule: 'statutory', page: '*', action: 'edit', description: 'Create/edit statutory slab/rate tables' },
  // Shift group
  { code: 'masters.shift.view', module: 'masters', submodule: 'shift', page: '*', action: 'view', description: 'View shift/OT definition tables' },
  { code: 'masters.shift.edit', module: 'masters', submodule: 'shift', page: '*', action: 'edit', description: 'Create/edit shift/OT definition tables' },
  // Dropdown group
  { code: 'masters.dropdown.view', module: 'masters', submodule: 'dropdown', page: '*', action: 'view', description: 'View dropdown master' },
  { code: 'masters.dropdown.edit', module: 'masters', submodule: 'dropdown', page: '*', action: 'edit', description: 'Create/edit dropdown master' },
  // Definition group
  { code: 'masters.definition.view', module: 'masters', submodule: 'definition', page: '*', action: 'view', description: 'View leave/loan/asset definition tables' },
  { code: 'masters.definition.edit', module: 'masters', submodule: 'definition', page: '*', action: 'edit', description: 'Create/edit leave/loan/asset definition tables' },
];

const ALL_PERMISSIONS: PermDef[] = [
  ...MASTER_PERMISSIONS,
  { code: 'system.test.demo.view', module: 'system', submodule: 'test', page: 'demo', action: 'view', description: 'Test permission for RBAC skeleton demo' },
];

const VIEW_ONLY_CODES = MASTER_PERMISSIONS
  .filter((p) => p.action === 'view')
  .map((p) => p.code)
  .concat(['system.test.demo.view']);

export async function POST() {
  const results: { permissions: number; roles: number; assignments: number } = {
    permissions: 0,
    roles: 0,
    assignments: 0,
  };

  // 1. Upsert all permissions
  for (const perm of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: {
        code: perm.code,
        module: perm.module,
        submodule: perm.submodule,
        page: perm.page,
        action: perm.action,
        description: perm.description,
      },
    });
    results.permissions++;
  }

  // 2. Upsert roles
  const adminRole = await prisma.role.upsert({
    where: { code: 'admin' },
    update: {},
    create: { code: 'admin', name: 'Administrator', description: 'Full access to all master tables' },
  });
  const viewerRole = await prisma.role.upsert({
    where: { code: 'viewer' },
    update: {},
    create: { code: 'viewer', name: 'View-Only Tester', description: 'View access to all master tables, no edit' },
  });
  results.roles = 2;

  // 3. Grant all permissions to admin
  for (const perm of ALL_PERMISSIONS) {
    const p = await prisma.permission.findUnique({ where: { code: perm.code } });
    if (!p) continue;
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: p.id },
    });
    results.assignments++;
  }

  // 4. Grant view-only permissions to viewer
  for (const code of VIEW_ONLY_CODES) {
    const p = await prisma.permission.findUnique({ where: { code } });
    if (!p) continue;
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: viewerRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: viewerRole.id, permissionId: p.id },
    });
    results.assignments++;
  }

  return NextResponse.json({
    message: 'Seed complete',
    ...results,
    adminRoleId: adminRole.id,
    viewerRoleId: viewerRole.id,
  });
}
