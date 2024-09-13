import { useCallback, useMemo, useReducer, useState } from "react";
import { v4 as uuid } from "uuid";

import { formatMoney } from "@/lib/utils";
import { type PokerTable, Table } from "@/models/table";

const getTableFromLocalStorage = () => {
  try {
    const tableFromLocalStorage = localStorage.getItem("table");
    const data = tableFromLocalStorage ? JSON.parse(tableFromLocalStorage) : null;

    if (!data) return null;

    return Table.fromJSON(data, formatMoney);
  } catch (error) {
    return null;
  }
};

const saveTableToLocalStorage = (table: Table) => {
  localStorage.setItem("table", JSON.stringify(table.toJSON()));
};

function useTable(onSave: (table: Table) => Promise<void>) {
  const forceUpdate = useReducer(() => ({}), {})[1];
  const [table, setTable] = useState(
    () => getTableFromLocalStorage() ?? new Table(uuid(), formatMoney),
  );

  const saveTable = useCallback(
    (table: Table) => {
      saveTableToLocalStorage(table);
      forceUpdate();
      void onSave(table);
    },
    [forceUpdate, onSave],
  );

  return useMemo(
    () => ({
      resetTable: () => {
        const table = new Table(uuid(), formatMoney);

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
        calculateTransfers() {
          return table.calculateTransfers();
        },
        toJSON() {
          return table.toJSON();
        },
      } satisfies PokerTable as PokerTable,
    }),
    [saveTable, table],
  );
}

export { useTable };
