import { AsyncLocalStorage } from "node:async_hooks";
import type { UnitOfWork } from "@signaltrack/application";
import type { Db } from "./client.js";
import { createSql } from "./client.js";

const transactionStorage = new AsyncLocalStorage<Db>();
const defaultDb = createSql();

export class PostgresUnitOfWork implements UnitOfWork {
  public async run<T>(fn: () => Promise<T>): Promise<T> {
    const current = transactionStorage.getStore();
    if (current) return fn();

    return defaultDb.begin(async (tx) => {
      return transactionStorage.run(tx as unknown as Db, fn);
    }) as unknown as Promise<T>;
  }

  public static current(): Db | null {
    return transactionStorage.getStore() ?? null;
  }
}
