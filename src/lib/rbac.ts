import type { Role } from "@/types/admin";

export const PERMISSIONS = {
  manageAdmins: ["super_admin"],
  manageBooks: ["super_admin", "store_manager"],
  manageOrders: ["super_admin", "support"],
  issueRefunds: ["super_admin", "support"],
  manageCustomers: ["super_admin", "support"],
  manageContent: ["super_admin", "content_editor"], // blog + categories
  manageSocialLinks: ["super_admin", "content_editor"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role | undefined, action: Permission): boolean {
  if (!role) return false;
  return (PERMISSIONS[action] as readonly Role[]).includes(role);
}
