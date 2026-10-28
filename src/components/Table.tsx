import AddPlayerForm from "./AddPlayerForm";
import { chipColorAt } from "./Chip";
import { FeltTable, type Player } from "./FeltTable";
import { HeaderActions } from "./TableHeader";
import { ClosingTab, MovementsTab, PlayersTab } from "./TableSections";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { formatMoney } from "@/lib/utils";
import { Table, type PokerTable, type TableData } from "@/models/table";

function TabButtons({ tabs }: { tabs: Array<{ value: string; label: string }> }) {
  return (
    <TabsList className="h-auto w-full rounded-full bg-card p-1">
      {tabs.map(({ value, label }) => (
        <TabsTrigger
          key={value}
          className="h-11 rounded-full text-sm font-extrabold text-[#cfe0d6] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground"
          value={value}
        >
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

function TableComponent({ table, resetTable }: { table: PokerTable; resetTable?: () => void }) {
  const isDesktop = useIsDesktop();
  const readOnly = !resetTable;
  const players: Array<Player> = Object.entries(table.players()).map(([name, balance], index) => ({
    name,
    balance,
    playing: table.isInGame(name),
    color: chipColorAt(index),
  }));
  const seated = players.filter((player) => player.playing);
  const brand = (
    <div className="flex items-center justify-between">
      <h1 className="font-display text-lg font-extrabold tracking-[0.06em] text-primary uppercase lg:text-xl">
        Pokereros
      </h1>
      <HeaderActions resetTable={resetTable} tableId={table.getId()} />
    </div>
  );

  // Wide screens show the table and everything about it at once; the players list no longer needs a tab.
  if (isDesktop) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[1800px] flex-col px-8 2xl:px-12">
        <header className="pt-4">{brand}</header>
        <div className="grid grid-cols-[minmax(0,6fr)_minmax(0,5fr)] items-start gap-10 pt-4 pb-10 2xl:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,4fr)] 2xl:gap-12">
          <section aria-label="Mesa" className="sticky top-6 flex flex-col gap-16 pt-8">
            <FeltTable large pot={table.totalBalance()} seated={seated} />
            {readOnly ? null : <AddPlayerForm table={table} />}
          </section>
          {/* From 2xl on, this column's two sections become columns of their own. */}
          <div className="flex flex-col gap-8 2xl:contents">
            <section aria-labelledby="players-heading" className="flex flex-col gap-1">
              <h2
                className="font-display text-2xl font-extrabold text-brass-light"
                id="players-heading"
              >
                Jugadores
              </h2>
              <PlayersTab players={players} readOnly={readOnly} table={table} />
            </section>
            <Tabs className="gap-0" defaultValue="movimientos">
              <TabButtons
                tabs={[
                  { value: "movimientos", label: "Movimientos" },
                  { value: "cierre", label: "Cierre" },
                ]}
              />
              <TabsContent value="movimientos">
                <MovementsTab readOnly={readOnly} table={table} />
              </TabsContent>
              <TabsContent value="cierre">
                <ClosingTab players={players} readOnly={readOnly} table={table} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      <header className="flex flex-col gap-3 px-5 pt-3">
        {brand}
        <FeltTable pot={table.totalBalance()} seated={seated} />
      </header>
      <Tabs className="flex-1 gap-4 px-5 pt-9 pb-4" defaultValue="mesa">
        <TabButtons
          tabs={[
            { value: "mesa", label: "Mesa" },
            { value: "movimientos", label: "Movimientos" },
            { value: "cierre", label: "Cierre" },
          ]}
        />
        <TabsContent value="mesa">
          <PlayersTab players={players} readOnly={readOnly} table={table} />
        </TabsContent>
        <TabsContent value="movimientos">
          <MovementsTab readOnly={readOnly} table={table} />
        </TabsContent>
        <TabsContent value="cierre">
          <ClosingTab players={players} readOnly={readOnly} table={table} />
        </TabsContent>
      </Tabs>
      {readOnly ? null : (
        <footer className="sticky bottom-0 bg-linear-to-b from-transparent to-background to-30% px-5 pt-3 pb-5">
          <AddPlayerForm table={table} />
        </footer>
      )}
    </div>
  );
}

function TableFromObject({ tableData }: { tableData: TableData }) {
  const table = Table.fromJSON(tableData, formatMoney);

  return <TableComponent table={table} />;
}

export { TableFromObject };
export default TableComponent;
