export type ServerFieldErrors = Record<string, string>;

export function mapServerErrorToFields(error: unknown): {
  message: string;
  fieldErrors: ServerFieldErrors;
} {
  if (error instanceof Error) {
    return {
      message: error.message || "Request failed.",
      fieldErrors: {}
    };
  }

  return {
    message: "An unexpected server error occurred.",
    fieldErrors: {}
  };
}
