import postgres, { type Sql } from "postgres";
import { env } from "../env.js";

export type Db = Sql<Record<string, unknown>>;

export const createSql = (connectionString = env.DATABASE_URL): Db => postgres(connectionString);

export const createTestSql = (): Db => postgres(env.TEST_DATABASE_URL);
