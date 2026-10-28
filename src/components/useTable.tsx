import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import { formatMoney } from "@/lib/utils";
import { type PokerTable, Table, type TableData } from "@/models/table";

const getTableFromLocalStorage = () => {
  try {
    const tableFromLocalStorage = localStorage.getItem("table");

    if (!tableFromLocalStorage) return null;

    return Table.fromJSON(JSON.parse(tableFromLocalStorage), formatMoney);
  } catch {
    return null;
  }
};

const saveTableToLocalStorage = (table: Table) => {
  localStorage.setItem("table", JSON.stringify(table.toJSON()));
};

type OnSave = (table: TableData) => Promise<void>;

function useTable(onSave: OnSave) {
  const forceUpdate = useReducer(() => ({}), {})[1];
  const [table, setTable] = useState(
    () => getTableFromLocalStorage() ?? new Table(crypto.randomUUID(), formatMoney),
  );

  const saveTable = useCallback(
    (table: Table) => {
      saveTableToLocalStorage(table);
      forceUpdate();
      void onSave(table.toJSON());
    },
    [forceUpdate, onSave],
  );

  // Saving right away claims the table for this browser before its link can be shared,
  // and keeps it from expiring while it's still in use.
  useEffect(() => {
    saveTableToLocalStorage(table);
    void onSave(table.toJSON());
  }, [onSave, table]);

  return useMemo(
    () => ({
      resetTable: () => {
        const table = new Table(crypto.randomUUID(), formatMoney);

        setTable(table);
        saveTable(table);
      },
      table: {
        getId() {
          return table.getId();
        },
        addPlayer: (name: string, alias: string, amount: number) => {
          table.addPlayer(name, alias, amount);
          saveTable(table);
        },
        reBuy: (player: string, amount: number) => {
          table.reBuy(player, amount);
          saveTable(table);
        },
        cashOut: (player: string, amount: number) => {
          table.cashOut(player, amount);
          saveTable(table);
        },
        editMovement(index: number, amount: number) {
          table.editMovement(index, amount);
          saveTable(table);
        },
        deleteMovement(index: number) {
          table.deleteMovement(index);
          saveTable(table);
        },
        isInGame(player: string) {
          return table.isInGame(player);
        },
        totalBalance() {
          return table.totalBalance();
        },
        players() {
          return table.players();
        },
        getMovements() {
          return table.getMovements();
        },
        settlements() {
          return table.settlements();
        },
        toJSON() {
          return table.toJSON();
        },
      } satisfies PokerTable,
    }),
    [saveTable, table],
  );
}

export { type OnSave, useTable };
