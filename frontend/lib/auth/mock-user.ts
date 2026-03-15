import type { CurrentUser } from "@/lib/auth/types";

export const mockCurrentUser: CurrentUser = {
  id: "user_001",
  orgId: "org_001",
  displayName: "Kim Example",
  email: "kim@example.com",
  roles: ["engineer", "engineering_manager"]
};
