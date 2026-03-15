import type { OwnershipRecord } from "../../types/index.js";

export interface OwnershipStore {
  endActiveAccountableOwner(orgId: string, defectId: string): Promise<void>;
  createAccountableOwner(orgId: string, defectId: string, userId: string): Promise<OwnershipRecord>;
}
