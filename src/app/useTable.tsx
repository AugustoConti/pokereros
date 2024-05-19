import { useMemo, useReducer, useState } from "react";

import { formatMoney } from "@/lib/utils";
import { type PokerTable, Table } from "@/models/table";

const getTableFromLocalStorage = () => {
  if (typeof localStorage === "undefined") return null;

  const tableFromLocalStorage = localStorage.getItem("table");

  if (!tableFromLocalStorage) return null;

  const data = JSON.parse(tableFromLocalStorage);

  if (!data) return null;

  return Table.fromJSON(data);
};

const saveTableToLocalStorage = (table: Table) => {
  localStorage.setItem("table", JSON.stringify(table.toJSON()));
};

const removeTableFromLocalStorage = () => {
  localStorage.removeItem("table");
};

function useTable() {
  const forceUpdate = useReducer(() => ({}), {})[1];
  const [table, setTable] = useState(() => getTableFromLocalStorage() ?? new Table(formatMoney));

  return useMemo<{ table: PokerTable; resetTable: () => void }>(
    () => ({
      resetTable: () => {
        removeTableFromLocalStorage();
        setTable(new Table(formatMoney));
      },
      table: {
        addPlayer: (name: string, alias: string, amount: number) => {
          table.addPlayer(name, alias, amount);
          saveTableToLocalStorage(table);
          forceUpdate();
        },
        reBuy: (player: string, amount: number) => {
          table.reBuy(player, amount);
          saveTableToLocalStorage(table);
          forceUpdate();
        },
        cashOut: (player: string, amount: number) => {
          table.cashOut(player, amount);
          saveTableToLocalStorage(table);
          forceUpdate();
        },
        editMovement(index: number, amount: number) {
          table.editMovement(index, amount);
          saveTableToLocalStorage(table);
          forceUpdate();
        },
        deleteMovement(index: number) {
          table.deleteMovement(index);
          saveTableToLocalStorage(table);
          forceUpdate();
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
      },
    }),
    [forceUpdate, table],
  );
}

export { useTable };
