/**
 * RBAC permission check utility.
 *
 * Permission granularity: module / submodule / page / action
 * e.g. { module: "employee", submodule: "profile", page: "list", action: "view" }
 *
 * A role has access if ANY of its RolePermission rows match the required permission.
 * Wildcard matching: if a Permission has submodule/page = "*", it matches any value.
 */

import { prisma } from './prisma';

export interface PermissionCheck {
  module: string;
  submodule?: string;
  page?: string;
  action: string;
}

/**
 * Check if a role has a specific permission.
 * Caches results in a simple Map for the request lifecycle.
 */
export async function hasPermission(
  roleId: number,
  required: PermissionCheck
): Promise<boolean> {
  const count = await prisma.rolePermission.count({
    where: {
      roleId,
      permission: {
        isActive: true,
        deletedAt: null,
        module: required.module,
        action: required.action,
        OR: [
          { submodule: null },
          { submodule: '*' },
          ...(required.submodule ? [{ submodule: required.submodule }] : []),
        ],
        AND: [
          {
            OR: [
              { page: null },
              { page: '*' },
              ...(required.page ? [{ page: required.page }] : []),
            ],
          },
        ],
      },
    },
  });

  return count > 0;
}
