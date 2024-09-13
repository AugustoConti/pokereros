/* eslint-disable padding-line-between-statements */
import { expect, it, describe } from "vitest";
import { ZodError } from "zod";

import { Table } from "./table";

const uuid = "91694f7a-9fe3-4fca-aad4-433700d3e4df";

function tableWith({ id }: { id?: string } = {}) {
  return new Table(id ?? uuid);
}

describe("players", () => {
  it("asd", () => {
    const table = tableWith();

    expect(table.players()).toEqual({});
  });

  it("asd", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);

    expect(table.players()).toEqual({ A: -100 });
  });

  it("asd", () => {
    const table = tableWith();

    expect(() => table.addPlayer("A", "A", -100)).toThrow(Table.amountMustBePositiveError);
  });

  it("asd", () => {
    const table = tableWith();

    expect(() => table.addPlayer("A", "A", 0)).toThrow(Table.amountMustBePositiveError);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    expect(() => table.addPlayer("A", "A", 100)).toThrow(Table.playerAlreadyInGameError);
  });

  it("asd", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);
    table.addPlayer("B", "A", 100);

    expect(table.players()).toEqual({ A: -100, B: -100 });
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.reBuy("A", 100);

    expect(table.players()).toEqual({ A: -200 });
  });

  it("asd", () => {
    const table = tableWith();

    expect(() => table.reBuy("A", 100)).toThrow(Table.playerNotFoundError);
  });

  it("asd", () => {
    const table = tableWith();

    expect(() => table.reBuy("A", -100)).toThrow(Table.amountMustBePositiveError);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    expect(() => table.reBuy("A", 100)).toThrow(Table.playerNotFoundError);
  });

  it("asd", () => {
    const table = tableWith();

    expect(() => table.cashOut("A", 100)).toThrow(Table.playerNotFoundError);
  });

  it("asd", () => {
    const table = tableWith();

    expect(() => table.cashOut("A", -100)).toThrow(Table.amountMustBePositiveError);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.cashOut("A", 100);

    expect(table.players()).toEqual({ A: 0 });
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.cashOut("A", 0);

    expect(table.players()).toEqual({ A: -100 });
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.cashOut("A", 200);

    expect(table.players()).toEqual({ A: 100 });
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    expect(() => table.cashOut("A", 100)).toThrow(Table.playerNotFoundError);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("B", "A", 100);
    table.cashOut("B", 0);
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    expect(() => table.cashOut("A", 100)).toThrow(Table.playerNotFoundError);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    table.addPlayer("A", "A", 100);

    expect(table.players()).toEqual({ A: -200 });
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);
    table.addPlayer("A", "A", 100);

    expect(() => table.addPlayer("A", "A", 100)).toThrow(Table.playerAlreadyInGameError);
  });
});

describe("is in game", () => {
  it("asd", () => {
    const table = tableWith();

    expect(table.isInGame("A")).toBe(false);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    expect(table.isInGame("A")).toBe(true);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    expect(table.isInGame("A")).toBe(false);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);
    table.addPlayer("A", "A", 100);

    expect(table.isInGame("A")).toBe(true);
  });
});

const mov = (player: string, amount: number, description: string) => ({
  player,
  amount,
  description,
});

describe("movements", () => {
  it("asd", () => {
    const table = tableWith();

    expect(table.getMovements()).toEqual([]);
  });

  it("asd", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);

    expect(table.getMovements()).toEqual([mov("A", 100, "A entró con 100")]);
  });

  it("asd", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);
    table.addPlayer("B", "A", 100);

    expect(table.getMovements()).toEqual([
      mov("A", 100, "A entró con 100"),
      mov("B", 100, "B entró con 100"),
    ]);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.reBuy("A", 100);

    expect(table.getMovements()).toEqual([
      mov("A", 100, "A entró con 100"),
      mov("A", 100, "A agregó 100"),
    ]);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.cashOut("A", 0);

    expect(table.getMovements()).toEqual([
      mov("A", 100, "A entró con 100"),
      mov("A", 0, "A se fué con 0"),
    ]);
  });
});

describe("balance", () => {
  it("asd", () => {
    const table = tableWith();

    expect(table.totalBalance()).toBe(0);
  });

  it("asd", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);

    expect(table.totalBalance()).toBe(100);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.reBuy("A", 50);

    expect(table.totalBalance()).toBe(150);
  });

  it("asd", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);
    table.addPlayer("B", "A", 100);

    expect(table.totalBalance()).toBe(200);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 100);

    expect(table.totalBalance()).toEqual(0);
  });
});

describe("edit movements", () => {
  it("cant edit movement does not exist", () => {
    const table = tableWith();

    expect(() => table.editMovement(0, 100)).toThrow(Table.movementNotFoundError);
  });

  it("edit movement of add player", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.editMovement(0, 200);

    expect(table.players()).toEqual({ A: -200 });
    expect(table.getMovements()).toEqual([mov("A", 200, "A entró con 200")]);
    expect(table.totalBalance()).toBe(200);
  });

  it("edit movement of rebuy player", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.reBuy("A", 100);

    table.editMovement(1, 200);

    expect(table.players()).toEqual({ A: -300 });
    expect(table.getMovements()).toEqual([
      mov("A", 100, "A entró con 100"),
      mov("A", 200, "A agregó 200"),
    ]);
    expect(table.totalBalance()).toBe(300);
  });

  it("edit movement of cashOut player", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    table.editMovement(1, 50);

    expect(table.players()).toEqual({ A: -50 });
    expect(table.getMovements()).toEqual([
      mov("A", 100, "A entró con 100"),
      mov("A", -50, "A se fué con 50"),
    ]);
    expect(table.totalBalance()).toBe(50);
  });

  it("edit movement of cashOut player", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    table.deleteMovement(1);

    expect(table.players()).toEqual({ A: -100 });
    expect(table.getMovements()).toEqual([mov("A", 100, "A entró con 100")]);
    expect(table.totalBalance()).toBe(100);
  });
});

describe("calculate transfers", () => {
  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 100);

    expect(table.calculateTransfers()).toEqual([]);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.addPlayer("B", "A", 50);
    table.cashOut("A", 100);

    expect(() => table.calculateTransfers()).toThrow(Table.balanceNotZeroError);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 50);
    table.cashOut("A", 0);
    table.cashOut("B", 150);

    expect(table.calculateTransfers()).toEqual(["A le debe 100 a B (alias.B)"]);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.cashOut("A", 50);
    table.cashOut("B", 150);

    expect(table.calculateTransfers()).toEqual(["A le debe 50 a B (alias.B)"]);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.cashOut("A", 100);
    table.cashOut("B", 100);

    expect(table.calculateTransfers()).toEqual([]);
  });

  it("uno le debe a varios", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.addPlayer("C", "alias.C", 100);
    table.cashOut("A", 0);
    table.cashOut("B", 150);
    table.cashOut("C", 150);

    expect(table.calculateTransfers()).toEqual([
      "A le debe 50 a B (alias.B)",
      "A le debe 50 a C (alias.C)",
    ]);
  });

  it("varios le deben a uno", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.addPlayer("C", "alias.C", 100);
    table.cashOut("A", 0);
    table.cashOut("B", 0);
    table.cashOut("C", 300);

    expect(table.calculateTransfers()).toEqual([
      "A le debe 100 a C (alias.C)",
      "B le debe 100 a C (alias.C)",
    ]);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.addPlayer("C", "alias.C", 100);
    table.addPlayer("D", "alias.D", 100);
    table.cashOut("A", 0);
    table.cashOut("B", 50);
    table.cashOut("C", 100);
    table.cashOut("D", 250);

    expect(table.calculateTransfers()).toEqual([
      "A le debe 100 a D (alias.D)",
      "B le debe 50 a D (alias.D)",
    ]);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.addPlayer("C", "alias.C", 100);
    table.addPlayer("D", "alias.D", 100);
    table.addPlayer("E", "alias.E", 100);
    table.cashOut("A", 0);
    table.cashOut("B", 50);
    table.cashOut("C", 50);
    table.cashOut("D", 250);
    table.cashOut("E", 150);

    expect(table.calculateTransfers()).toEqual([
      "A le debe 100 a D (alias.D)",
      "B le debe 50 a D (alias.D)",
      "C le debe 50 a E (alias.E)",
    ]);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.addPlayer("C", "alias.C", 100);
    table.addPlayer("D", "alias.D", 100);
    table.addPlayer("E", "alias.E", 100);
    table.cashOut("A", 0);
    table.cashOut("B", 50);
    table.cashOut("C", 100);
    table.cashOut("D", 150);
    table.cashOut("E", 200);

    expect(table.calculateTransfers()).toEqual([
      "A le debe 100 a E (alias.E)",
      "B le debe 50 a D (alias.D)",
    ]);
  });

  it("asd", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.addPlayer("C", "alias.C", 100);
    table.addPlayer("D", "alias.D", 100);
    table.addPlayer("E", "alias.E", 100);
    table.cashOut("A", 0);
    table.cashOut("B", 50);
    table.cashOut("C", 110);
    table.cashOut("D", 150);
    table.cashOut("E", 190);

    expect(table.calculateTransfers()).toEqual([
      "A le debe 90 a E (alias.E)",
      "B le debe 50 a D (alias.D)",
      "A le debe 10 a C (alias.C)",
    ]);
  });
});

describe("json", () => {
  it("empty table to json", () => {
    const table = tableWith({ id: uuid });

    expect(table.toJSON()).toEqual({ id: uuid, movements: [], aliases: {} });
  });

  it("table with movements to json", () => {
    const table = tableWith({ id: uuid });
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.reBuy("A", 100);
    table.cashOut("A", 100);
    table.cashOut("B", 200);

    expect(table.toJSON()).toEqual({
      id: uuid,
      movements: [
        { player: "A", amount: -100, type: "BuyIn" },
        { player: "B", amount: -100, type: "BuyIn" },
        { player: "A", amount: -100, type: "ReBuy" },
        { player: "A", amount: 100, type: "CashOut" },
        { player: "B", amount: 200, type: "CashOut" },
      ],
      aliases: { A: "alias.A", B: "alias.B" },
    });
  });

  it("empty table from json", () => {
    const table = Table.fromJSON({ id: uuid, movements: [], aliases: {} });

    expect(table.players()).toEqual({});
    expect(table.getMovements()).toEqual([]);
    expect(table.totalBalance()).toBe(0);
  });

  it("table with movements from json", () => {
    const table = Table.fromJSON({
      id: uuid,
      movements: [
        { player: "A", amount: -100, type: "BuyIn" },
        { player: "B", amount: -100, type: "BuyIn" },
        { player: "A", amount: -100, type: "ReBuy" },
        { player: "A", amount: 100, type: "CashOut" },
        { player: "B", amount: 200, type: "CashOut" },
      ],
      aliases: { A: "alias.A", B: "alias.B" },
    });

    expect(table.players()).toEqual({ A: -100, B: 100 });
    expect(table.getMovements()).toEqual([
      mov("A", 100, "A entró con 100"),
      mov("B", 100, "B entró con 100"),
      mov("A", 100, "A agregó 100"),
      mov("A", -100, "A se fué con 100"),
      mov("B", -200, "B se fué con 200"),
    ]);
    expect(table.totalBalance()).toBe(0);
  });

  it("broken json", () => {
    expect(() => Table.fromJSON({ id: "1", movements: [], aliases: {} })).toThrow(ZodError);
  });
});
