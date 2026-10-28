import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { assertTableOwner } from "./owner";
import { rateLimitMiddleware } from "./rate-limit";

import { getTableFromDB, setTableInDB } from "@/db/redis";
import { tableSchema } from "@/models/table";

function parseTable(raw: string) {
  try {
    const result = tableSchema.safeParse(JSON.parse(raw));

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export const getTable = createServerFn({ method: "GET" })
  .middleware([rateLimitMiddleware])
  .validator(z.string().max(100))
  .handler(async ({ data: id }) => {
    if (!z.uuid().safeParse(id).success) return null;

    const raw = await getTableFromDB(id);

    return raw === null ? null : parseTable(raw);
  });

export const saveTable = createServerFn({ method: "POST" })
  .middleware([rateLimitMiddleware])
  .validator(tableSchema)
  .handler(async ({ data: table }) => {
    await assertTableOwner(table.id);
    await setTableInDB(table.id, JSON.stringify(table));
  });
