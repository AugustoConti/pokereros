import type { TableData } from "@/models/table";

import { createFileRoute } from "@tanstack/react-router";

import Home from "@/components/Home";
import { saveTable } from "@/server/table";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <Home onSave={async (data: TableData) => await saveTable({ data })} />;
}
