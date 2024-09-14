import { kv } from "@vercel/kv";

import { TableFromObject } from "../Table";

async function ReadOnlyTable({ params }: { params: { id: string } }) {
  const { id } = params;
  const tableData = await kv.get(`table:${id}`);

  if (!tableData) {
    return <div className="p-4">Mesa no encontrada</div>;
  }

  return <TableFromObject tableData={tableData} />;
}

// eslint-disable-next-line import/no-unused-modules
export default ReadOnlyTable;
