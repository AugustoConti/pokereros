import Redis from "ioredis";

const client = new Redis(process.env.REDIS_URL ?? "");

async function getTableFromDB(id: string) {
  return await client.get(`table:${id}`);
}

async function setTableInDB(id: string, data: string) {
  return await client.set(`table:${id}`, data);
}

export { getTableFromDB, setTableInDB };
