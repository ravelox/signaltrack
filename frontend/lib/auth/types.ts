export type AppRole = "reporter" | "engineer" | "engineering_manager" | "org_admin";

export type CurrentUser = {
  id: string;
  orgId: string;
  displayName: string;
  email: string;
  roles: AppRole[];
};
