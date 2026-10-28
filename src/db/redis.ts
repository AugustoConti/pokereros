import Redis from "ioredis";

let redis: Redis | null = null;

// Connect on first use: importing this module (e.g. while prerendering) must not open a connection.
function client() {
  if (!redis) {
    const url = process.env["REDIS_URL"];

    if (!url) throw new Error("REDIS_URL is not set");

    // Fail fast instead of queueing commands while Redis is unreachable.
    redis = new Redis(url, { maxRetriesPerRequest: 1, connectTimeout: 5000 });
    // Without a listener ioredis logs every reconnect attempt as an unhandled error; commands still reject.
    redis.on("error", () => undefined);
  }

  return redis;
}

const TABLE_TTL_SECONDS = 60 * 60 * 24 * 30;

const tableKey = (id: string) => `table:${id}`;
const ownerKey = (id: string) => `table-owner:${id}`;

async function getTableFromDB(id: string) {
  return await client().get(tableKey(id));
}

async function setTableInDB(id: string, data: string) {
  await client()
    .multi()
    .set(tableKey(id), data, "EX", TABLE_TTL_SECONDS)
    .expire(ownerKey(id), TABLE_TTL_SECONDS)
    .exec();
}

/** Stores `ownerHash` as the table owner unless it already has one, and returns the current owner. */
async function claimTableOwner(id: string, ownerHash: string) {
  await client().set(ownerKey(id), ownerHash, "EX", TABLE_TTL_SECONDS, "NX");

  return await client().get(ownerKey(id));
}

/** Counts a hit in a fixed window and returns how many hits the window has so far. */
async function countHit(key: string, windowSeconds: number) {
  const window = Math.floor(Date.now() / 1000 / windowSeconds);
  const windowKey = `ratelimit:${key}:${window}`;
  const hits = await client().incr(windowKey);

  if (hits === 1) await client().expire(windowKey, windowSeconds);

  return hits;
}

export { claimTableOwner, countHit, getTableFromDB, setTableInDB };
