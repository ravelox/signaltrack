import type { AppRole } from "@/lib/auth/types";

export const roleRank: Record<AppRole, number> = {
  reporter: 1,
  engineer: 2,
  engineering_manager: 3,
  org_admin: 4
};

export function hasAnyRole(userRoles: AppRole[], allowed: AppRole[]): boolean {
  return allowed.some((role) => userRoles.includes(role));
}

export const routePermissions = {
  "/": ["reporter", "engineer", "engineering_manager", "org_admin"],
  "/signed-out": ["reporter", "engineer", "engineering_manager", "org_admin"],
  "/report": ["reporter", "engineer", "engineering_manager", "org_admin"],
  "/report/submitted": ["reporter", "engineer", "engineering_manager", "org_admin"],
  "/reports": ["engineer", "engineering_manager", "org_admin"],
  "/defects": ["engineer", "engineering_manager", "org_admin"],
  "/defects/new": ["engineer", "engineering_manager", "org_admin"],
  "/manager": ["engineering_manager", "org_admin"],
  "/admin/audit": ["org_admin"]
} satisfies Record<string, AppRole[]>;

export const actionPermissions = {
  createDefect: ["engineer", "engineering_manager", "org_admin"],
  changeOwner: ["engineer", "engineering_manager", "org_admin"],
  createNextAction: ["engineer", "engineering_manager", "org_admin"],
  updateStatuses: ["engineer", "engineering_manager", "org_admin"],
  viewManager: ["engineering_manager", "org_admin"],
  viewAudit: ["org_admin"]
} satisfies Record<string, AppRole[]>;
