/* eslint-disable padding-line-between-statements */
import { expect, it, describe } from "vitest";
import { ZodError } from "zod";

import { Table } from "./table";

const uuid = "91694f7a-9fe3-4fca-aad4-433700d3e4df";

function tableWith({ id }: { id?: string } = {}) {
  return new Table(id ?? uuid);
}

describe("players", () => {
  it("empty table has no players", () => {
    const table = tableWith();

    expect(table.players()).toEqual({});
  });

  it("buy in leaves the player owing that amount", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);

    expect(table.players()).toEqual({ A: -100 });
  });

  it("can't add a player with a negative amount", () => {
    const table = tableWith();

    expect(() => table.addPlayer("A", "A", -100)).toThrow(Table.amountMustBePositiveError);
  });

  it("can't add a player with zero amount", () => {
    const table = tableWith();

    expect(() => table.addPlayer("A", "A", 0)).toThrow(Table.amountMustBePositiveError);
  });

  it("can't add a player who is already in game", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    expect(() => table.addPlayer("A", "A", 100)).toThrow(Table.playerAlreadyInGameError);
  });

  it("add several players", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);
    table.addPlayer("B", "A", 100);

    expect(table.players()).toEqual({ A: -100, B: -100 });
  });

  it("rebuy adds to what the player owes", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.reBuy("A", 100);

    expect(table.players()).toEqual({ A: -200 });
  });

  it("can't rebuy a player who isn't in the table", () => {
    const table = tableWith();

    expect(() => table.reBuy("A", 100)).toThrow(Table.playerNotFoundError);
  });

  it("can't rebuy a negative amount", () => {
    const table = tableWith();

    expect(() => table.reBuy("A", -100)).toThrow(Table.amountMustBePositiveError);
  });

  it("can't rebuy a player who already cashed out", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    expect(() => table.reBuy("A", 100)).toThrow(Table.playerNotFoundError);
  });

  it("can't cash out a player who isn't in the table", () => {
    const table = tableWith();

    expect(() => table.cashOut("A", 100)).toThrow(Table.playerNotFoundError);
  });

  it("can't cash out a negative amount", () => {
    const table = tableWith();

    expect(() => table.cashOut("A", -100)).toThrow(Table.amountMustBePositiveError);
  });

  it("cashing out the buy in leaves the player even", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.cashOut("A", 100);

    expect(table.players()).toEqual({ A: 0 });
  });

  it("cashing out nothing leaves the player owing the buy in", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.cashOut("A", 0);

    expect(table.players()).toEqual({ A: -100 });
  });

  // Allowed on purpose: numbers can be off while the game is being settled.
  it("can cash out more than the pot", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.cashOut("A", 200);

    expect(table.players()).toEqual({ A: 100 });
    expect(table.totalBalance()).toBe(-100);
  });

  it("doesn't calculate transfers while the pot is over cashed out", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.addPlayer("B", "B", 100);
    table.cashOut("A", 300);

    expect(() => table.settlements()).toThrow(`${Table.balanceNotZeroError}100`);
  });

  it("calculates transfers once the over cashed out pot is fixed", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.addPlayer("B", "B", 100);
    table.cashOut("A", 300);
    table.cashOut("B", 0);

    table.editMovement(2, 200);

    expect(table.totalBalance()).toBe(0);
    expect(table.settlements()).toEqual([{ from: "B", to: "A", alias: "A", amount: 100 }]);
  });

  it("can't cash out a player twice", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    expect(() => table.cashOut("A", 100)).toThrow(Table.playerNotFoundError);
  });

  it("can't cash out a player twice after another player left", () => {
    const table = tableWith();
    table.addPlayer("B", "A", 100);
    table.cashOut("B", 0);
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    expect(() => table.cashOut("A", 100)).toThrow(Table.playerNotFoundError);
  });

  it("player can buy in again after cashing out", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    table.addPlayer("A", "A", 100);

    expect(table.players()).toEqual({ A: -200 });
  });

  it("can't buy in again while back in game", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);
    table.addPlayer("A", "A", 100);

    expect(() => table.addPlayer("A", "A", 100)).toThrow(Table.playerAlreadyInGameError);
  });
});

describe("is in game", () => {
  it("unknown player isn't in game", () => {
    const table = tableWith();

    expect(table.isInGame("A")).toBe(false);
  });

  it("player is in game after buying in", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    expect(table.isInGame("A")).toBe(true);
  });

  it("player isn't in game after cashing out", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 0);

    expect(table.isInGame("A")).toBe(false);
  });

  it("player is in game again after buying in again", () => {
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
  it("empty table has no movements", () => {
    const table = tableWith();

    expect(table.getMovements()).toEqual([]);
  });

  it("buy in is listed as a movement", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);

    expect(table.getMovements()).toEqual([mov("A", 100, "A entró con 100")]);
  });

  it("each buy in is listed as a movement", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);
    table.addPlayer("B", "A", 100);

    expect(table.getMovements()).toEqual([
      mov("A", 100, "A entró con 100"),
      mov("B", 100, "B entró con 100"),
    ]);
  });

  it("rebuy is listed as a movement", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.reBuy("A", 100);

    expect(table.getMovements()).toEqual([
      mov("A", 100, "A entró con 100"),
      mov("A", 100, "A agregó 100"),
    ]);
  });

  it("cash out is listed as a movement", () => {
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
  it("empty table has nothing in the pot", () => {
    const table = tableWith();

    expect(table.totalBalance()).toBe(0);
  });

  it("buy in goes to the pot", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);

    expect(table.totalBalance()).toBe(100);
  });

  it("rebuy goes to the pot", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);

    table.reBuy("A", 50);

    expect(table.totalBalance()).toBe(150);
  });

  it("every buy in goes to the pot", () => {
    const table = tableWith();

    table.addPlayer("A", "A", 100);
    table.addPlayer("B", "A", 100);

    expect(table.totalBalance()).toBe(200);
  });

  it("cash out takes from the pot", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 100);

    expect(table.totalBalance()).toEqual(0);
  });
});

describe("edit movements", () => {
  it("can't edit a movement that doesn't exist", () => {
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

  it("delete movement of cashOut player", () => {
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
  it("no transfers when the only player breaks even", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.cashOut("A", 100);

    expect(table.settlements()).toEqual([]);
  });

  it("can't calculate transfers while the pot isn't empty", () => {
    const table = tableWith();
    table.addPlayer("A", "A", 100);
    table.addPlayer("B", "A", 50);
    table.cashOut("A", 100);

    expect(() => table.settlements()).toThrow(Table.balanceNotZeroError);
  });

  it("loser pays the winner", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 50);
    table.cashOut("A", 0);
    table.cashOut("B", 150);

    expect(table.settlements()).toEqual([{ from: "A", to: "B", alias: "alias.B", amount: 100 }]);
  });

  it("loser pays only what they lost", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.cashOut("A", 50);
    table.cashOut("B", 150);

    expect(table.settlements()).toEqual([{ from: "A", to: "B", alias: "alias.B", amount: 50 }]);
  });

  it("no transfers when everyone breaks even", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.cashOut("A", 100);
    table.cashOut("B", 100);

    expect(table.settlements()).toEqual([]);
  });

  it("one loser pays several winners", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.addPlayer("C", "alias.C", 100);
    table.cashOut("A", 0);
    table.cashOut("B", 150);
    table.cashOut("C", 150);

    expect(table.settlements()).toEqual([
      { from: "A", to: "B", alias: "alias.B", amount: 50 },
      { from: "A", to: "C", alias: "alias.C", amount: 50 },
    ]);
  });

  it("several losers pay one winner", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.addPlayer("C", "alias.C", 100);
    table.cashOut("A", 0);
    table.cashOut("B", 0);
    table.cashOut("C", 300);

    expect(table.settlements()).toEqual([
      { from: "A", to: "C", alias: "alias.C", amount: 100 },
      { from: "B", to: "C", alias: "alias.C", amount: 100 },
    ]);
  });

  it("players who break even aren't part of the transfers", () => {
    const table = tableWith();
    table.addPlayer("A", "alias.A", 100);
    table.addPlayer("B", "alias.B", 100);
    table.addPlayer("C", "alias.C", 100);
    table.addPlayer("D", "alias.D", 100);
    table.cashOut("A", 0);
    table.cashOut("B", 50);
    table.cashOut("C", 100);
    table.cashOut("D", 250);

    expect(table.settlements()).toEqual([
      { from: "A", to: "D", alias: "alias.D", amount: 100 },
      { from: "B", to: "D", alias: "alias.D", amount: 50 },
    ]);
  });

  it("each loser pays the biggest winner left", () => {
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

    expect(table.settlements()).toEqual([
      { from: "A", to: "D", alias: "alias.D", amount: 100 },
      { from: "B", to: "D", alias: "alias.D", amount: 50 },
      { from: "C", to: "E", alias: "alias.E", amount: 50 },
    ]);
  });

  it("biggest loser pays the biggest winner", () => {
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

    expect(table.settlements()).toEqual([
      { from: "A", to: "E", alias: "alias.E", amount: 100 },
      { from: "B", to: "D", alias: "alias.D", amount: 50 },
    ]);
  });

  it("loser pays several winners when the amounts don't match", () => {
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

    expect(table.settlements()).toEqual([
      { from: "A", to: "E", alias: "alias.E", amount: 90 },
      { from: "B", to: "D", alias: "alias.D", amount: 50 },
      { from: "A", to: "C", alias: "alias.C", amount: 10 },
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
