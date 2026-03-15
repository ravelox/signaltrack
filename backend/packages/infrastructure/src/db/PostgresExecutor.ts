import type { Sql } from "postgres";
import { createSql, type Db } from "./client.js";
import { PostgresUnitOfWork } from "./PostgresUnitOfWork.js";

const defaultDb = createSql();

export class PostgresExecutor {
  public constructor(private readonly baseDb?: Sql<Record<string, unknown>>) {}

  public get db(): Db {
    return (PostgresUnitOfWork.current() ?? this.baseDb ?? defaultDb) as Db;
  }
}
