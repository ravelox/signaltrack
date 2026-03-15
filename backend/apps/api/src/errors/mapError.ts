import { DomainError } from "@signaltrack/shared";

export const mapError = (error: unknown) => {
  if (error instanceof DomainError) {
    return { statusCode: 400, body: { error: { code: error.code, message: error.message, details: error.details ?? {} } } };
  }
  return { statusCode: 500, body: { error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." } } };
};
