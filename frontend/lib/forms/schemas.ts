import { z } from "zod";

export const reportFormSchema = z.object({
  rawDescription: z.string().min(10, "Describe what happened in a bit more detail."),
  expectedBehavior: z.string().min(3, "Tell us what you expected.").optional().or(z.literal("")),
  observedBehavior: z.string().min(3, "Tell us what happened instead.").optional().or(z.literal("")),
  impactLevel: z.enum(["annoying", "slows_me_down", "blocking"]),
  workaroundAvailable: z.boolean().optional(),
  contactAllowed: z.boolean(),
  environmentSnapshot: z.record(z.any())
});

export const changeOwnerSchema = z.object({
  defectId: z.string().min(1),
  userId: z.string().min(1, "Choose a new accountable owner.")
});

export const createNextActionSchema = z.object({
  defectId: z.string().min(1),
  ownerUserId: z.string().min(1, "Choose an owner for the next action."),
  summary: z.string().min(5, "Give the next action a clear summary."),
  dueAt: z.string().min(1, "Choose a due date/time.")
});

export const updateStatusesSchema = z.object({
  defectId: z.string().min(1),
  reporterStatus: z.string().min(1, "Choose a reporter-facing status."),
  internalStatus: z.string().min(1, "Choose an internal status.")
});
