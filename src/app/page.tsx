import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

import Home from "./Home";

function Page({ onSave }: { onSave?: (id: string, table: string) => Promise<void> }) {
  async function postTable(id: string, table: string) {
    "use server";
    await kv.set(`table:${id}`, table);
    revalidatePath(`/${id}`);
  }

  return <Home onSave={onSave ?? postTable} />;
}

// eslint-disable-next-line import/no-unused-modules
export default Page;
