import { useCallback, useMemo, useReducer, useState } from "react";

import { formatMoney } from "@/lib/utils";
import { type PokerTable, Table } from "@/models/table";

// type Req = Omit<RequestInit, "body"> & {
//   body?: Record<string, unknown>;
// };

// async function client(endpoint: string, { body, ...config }: Req = {}) {
//   return await fetch(endpoint, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     method: body ? "POST" : "GET",
//     body: body ? JSON.stringify(body) : undefined,
//     ...config,
//   }).then(async (r) => {
//     if (r.ok) {
//       return await r.json();
//     }
//
//     throw new Error("fail to fetch");
//   });
// }

// async function fetchTable(id: string) {
//   return await client(`/api?id=${id}`);
// }

// async function postTable(id: string, table: PokerTable) {
//   return await client(`/api?id=${id}`, { body: table.toJSON() });
// }

const getTableFromLocalStorage = () => {
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

// function getId() {
//   let id = localStorage.getItem("table");
//
//   if (!id) {
//     id = uuid();
//     localStorage.setItem("table", id);
//   }
//
//   return id;
// }

function useTable() {
  // const [id] = useState(() => getId());
  const forceUpdate = useReducer(() => ({}), {})[1];
  const [table, setTable] = useState(() => getTableFromLocalStorage() ?? new Table(formatMoney));

  const saveTable = useCallback(() => {
    forceUpdate();
    // void postTable(id, table);
  }, [forceUpdate]);

  return useMemo(
    () => ({
      resetTable: () => {
        removeTableFromLocalStorage();
        setTable(new Table(formatMoney));
      },
      table: {
        addPlayer: (name: string, alias: string, amount: number) => {
          table.addPlayer(name, alias, amount);
          saveTableToLocalStorage(table);
          saveTable();
        },
        reBuy: (player: string, amount: number) => {
          table.reBuy(player, amount);
          saveTableToLocalStorage(table);
          saveTable();
        },
        cashOut: (player: string, amount: number) => {
          table.cashOut(player, amount);
          saveTableToLocalStorage(table);
          saveTable();
        },
        editMovement(index: number, amount: number) {
          table.editMovement(index, amount);
          saveTableToLocalStorage(table);
          saveTable();
        },
        deleteMovement(index: number) {
          table.deleteMovement(index);
          saveTableToLocalStorage(table);
          saveTable();
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
