import { useMemo, useReducer, useState } from "react";

import { formatMoney } from "@/lib/utils";
import { type PokerTable, Table } from "@/models/table";

function useTable() {
  const forceUpdate = useReducer(() => ({}), {})[1];
  const [table] = useState(() => new Table(formatMoney));

  return useMemo<PokerTable>(
    () => ({
      addPlayer: (name: string, alias: string, amount: number) => {
        table.addPlayer(name, alias, amount);
        forceUpdate();
      },
      reBuy: (player: string, amount: number) => {
        table.reBuy(player, amount);
        forceUpdate();
      },
      cashOut: (player: string, amount: number) => {
        table.cashOut(player, amount);
        forceUpdate();
      },
      editMovement(index: number, amount: number) {
        table.editMovement(index, amount);
        forceUpdate();
      },
      deleteMovement(index: number) {
        table.deleteMovement(index);
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
    }),
    [forceUpdate, table],
  );
}

export { useTable };
