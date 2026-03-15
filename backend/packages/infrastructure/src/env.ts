export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/signaltrack",
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/signaltrack_test",
  AWS_REGION: process.env.AWS_REGION ?? "us-east-1",
  S3_BUCKET: process.env.S3_BUCKET ?? "signaltrack-local",
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_FORCE_PATH_STYLE: (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true",
  SIGNED_URL_TTL_SECONDS: Number(process.env.SIGNED_URL_TTL_SECONDS ?? 900)
};
