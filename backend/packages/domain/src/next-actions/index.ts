import { DomainError } from "@signaltrack/shared";

export const assertCompletionNote = (
  status: "open" | "done" | "blocked" | "canceled",
  completionNote?: string
): void => {
  if (status === "done" && (!completionNote || !completionNote.trim())) {
    throw new DomainError(
      "NEXT_ACTION_COMPLETION_NOTE_REQUIRED",
      "Completing a next action requires a completion note."
    );
  }
};
