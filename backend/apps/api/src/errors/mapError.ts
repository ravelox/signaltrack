import { ZodError } from "zod";
import { DomainError } from "@signaltrack/shared";

export const mapError = (error: unknown) => {
  if (error instanceof DomainError) {
    return { statusCode: 400, body: { error: { code: error.code, message: error.message, details: error.details ?? {} } } };
  }
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      body: {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed.",
          details: error.flatten()
        }
      }
    };
  }
  return { statusCode: 500, body: { error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." } } };
};
