import { createFileRoute } from "@tanstack/react-router";

import { TableFromObject } from "@/components/Table";
import { getTable } from "@/server/table";

export const Route = createFileRoute("/$id")({
  loader: async ({ params: { id } }) => await getTable({ data: id }),
  component: ReadOnlyTable,
});

function ReadOnlyTable() {
  const tableData = Route.useLoaderData();

  if (!tableData) {
    return <div className="p-4">Mesa no encontrada</div>;
  }

  return <TableFromObject tableData={tableData} />;
}
