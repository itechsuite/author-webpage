export type Role = "super_admin" | "store_manager" | "content_editor" | "support";

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  store_manager: "Store Manager",
  content_editor: "Content Editor",
  support: "Support",
};

export interface AdminAccount {
  _id?: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
