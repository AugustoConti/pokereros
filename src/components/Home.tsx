import TableComponent from "./Table";
import { type OnSave, useTable } from "./useTable";

function Home({ onSave }: { onSave: OnSave }) {
  const { table, resetTable } = useTable(onSave);

  return <TableComponent resetTable={resetTable} table={table} />;
}

export default Home;
