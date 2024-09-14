"use client";

import { useEffect, useState } from "react";

import TableComponent from "./Table";
import { useTable } from "./useTable";

function Home({ onSave }: { onSave: (id: string, table: string) => Promise<void> }) {
  const { table, resetTable } = useTable(onSave);

  return <TableComponent resetTable={resetTable} table={table} />;
}

function HomePage({ onSave }: { onSave: (id: string, table: string) => Promise<void> }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <Home onSave={onSave} /> : null;
}

export default HomePage;
