import type { NextActionRecord } from "../../types/index.js";

export interface CreateNextActionInput {
  orgId: string;
  defectId: string;
  ownerUserId: string;
  summary: string;
  dueAt: string;
  createdByUserId: string;
}

export interface NextActionStore {
  countOpenForDefect(orgId: string, defectId: string): Promise<number>;
  createCurrent(input: CreateNextActionInput): Promise<NextActionRecord>;
}
