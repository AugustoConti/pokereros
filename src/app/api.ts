import { type PokerTable } from "@/models/table";

type Req = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown>;
};

async function client(endpoint: string, { body, ...config }: Req = {}) {
  return await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    ...config,
  }).then(async (r) => {
    if (r.ok) {
      return await r.json();
    }

    throw new Error("fail to fetch");
  });
}

// async function fetchTable(id: string) {
//   return await client(`/api/sync?id=${id}`);
// }

async function postTable(table: PokerTable) {
  return await client(`/api/sync?id=${table.getId()}`, { body: table.toJSON() });
}

export { postTable };
