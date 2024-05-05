/* eslint-disable padding-line-between-statements */
import { expect, it, describe, suite } from "vitest";

import Table from "./table";

suite("poker", () => {
  describe("players", () => {
    it("asd", () => {
      const table = new Table();

      expect(table.players()).toEqual({});
    });

    it("asd", () => {
      const table = new Table();

      table.addPlayer("A", "A", 100);

      expect(table.players()).toEqual({ A: -100 });
    });

    it("asd", () => {
      const table = new Table();

      expect(() => table.addPlayer("A", "A", -100)).toThrow(Table.amountMustBePositiveError);
    });

    it("asd", () => {
      const table = new Table();

      expect(() => table.addPlayer("A", "A", 0)).toThrow(Table.amountMustBePositiveError);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);

      expect(() => table.addPlayer("A", "A", 100)).toThrow(Table.playerAlreadyInGameError);
    });

    it("asd", () => {
      const table = new Table();

      table.addPlayer("A", "A", 100);
      table.addPlayer("B", "A", 100);

      expect(table.players()).toEqual({ A: -100, B: -100 });
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);

      table.reBuy("A", 100);

      expect(table.players()).toEqual({ A: -200 });
    });

    it("asd", () => {
      const table = new Table();

      expect(() => table.reBuy("A", 100)).toThrow(Table.playerNotFoundError);
    });

    it("asd", () => {
      const table = new Table();

      expect(() => table.reBuy("A", -100)).toThrow(Table.amountMustBePositiveError);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);
      table.cashOut("A", 0);

      expect(() => table.reBuy("A", 100)).toThrow(Table.playerNotFoundError);
    });

    it("asd", () => {
      const table = new Table();

      expect(() => table.cashOut("A", 100)).toThrow(Table.playerNotFoundError);
    });

    it("asd", () => {
      const table = new Table();

      expect(() => table.cashOut("A", -100)).toThrow(Table.amountMustBePositiveError);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);

      table.cashOut("A", 100);

      expect(table.players()).toEqual({ A: 0 });
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);

      table.cashOut("A", 0);

      expect(table.players()).toEqual({ A: -100 });
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);

      table.cashOut("A", 200);

      expect(table.players()).toEqual({ A: 100 });
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);
      table.cashOut("A", 0);

      expect(() => table.cashOut("A", 100)).toThrow(Table.playerNotFoundError);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("B", "A", 100);
      table.cashOut("B", 0);
      table.addPlayer("A", "A", 100);
      table.cashOut("A", 0);

      expect(() => table.cashOut("A", 100)).toThrow(Table.playerNotFoundError);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);
      table.cashOut("A", 0);

      table.addPlayer("A", "A", 100);

      expect(table.players()).toEqual({ A: -200 });
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);
      table.cashOut("A", 0);
      table.addPlayer("A", "A", 100);

      expect(() => table.addPlayer("A", "A", 100)).toThrow(Table.playerAlreadyInGameError);
    });
  });

  describe("movements", () => {
    it("asd", () => {
      const table = new Table();

      expect(table.getMovements()).toEqual([]);
    });

    it("asd", () => {
      const table = new Table();

      table.addPlayer("A", "A", 100);

      expect(table.getMovements()).toEqual(["A entró con 100"]);
    });

    it("asd", () => {
      const table = new Table();

      table.addPlayer("A", "A", 100);
      table.addPlayer("B", "A", 100);

      expect(table.getMovements()).toEqual(["A entró con 100", "B entró con 100"]);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);

      table.reBuy("A", 100);

      expect(table.getMovements()).toEqual(["A entró con 100", "A recompró 100"]);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);

      table.cashOut("A", 0);

      expect(table.getMovements()).toEqual(["A entró con 100", "A se fué con 0"]);
    });
  });

  describe("balance", () => {
    it("asd", () => {
      const table = new Table();

      expect(table.totalBalance()).toBe(0);
    });

    it("asd", () => {
      const table = new Table();

      table.addPlayer("A", "A", 100);

      expect(table.totalBalance()).toBe(100);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);

      table.reBuy("A", 50);

      expect(table.totalBalance()).toBe(150);
    });

    it("asd", () => {
      const table = new Table();

      table.addPlayer("A", "A", 100);
      table.addPlayer("B", "A", 100);

      expect(table.totalBalance()).toBe(200);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);
      table.cashOut("A", 100);

      expect(table.totalBalance()).toEqual(0);
    });
  });

  describe("edit movements", () => {
    it("cant edit movement does not exist", () => {
      const table = new Table();

      expect(() => table.editMovement(0, "A", 100)).toThrow(Table.movementNotFoundError);
    });

    it("edit movement of add player", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);

      table.editMovement(0, "A", 200);

      expect(table.players()).toEqual({ A: -200 });
      expect(table.getMovements()).toEqual(["A entró con 200"]);
      expect(table.totalBalance()).toBe(200);
    });

    it("edit movement of rebuy player", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);
      table.reBuy("A", 100);

      table.editMovement(1, "A", 200);

      expect(table.players()).toEqual({ A: -300 });
      expect(table.getMovements()).toEqual(["A entró con 100", "A recompró 200"]);
      expect(table.totalBalance()).toBe(300);
    });

    it("edit movement of cashOut player", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);
      table.cashOut("A", 0);

      table.editMovement(1, "A", 50);

      expect(table.players()).toEqual({ A: -50 });
      expect(table.getMovements()).toEqual(["A entró con 100", "A se fué con 50"]);
      expect(table.totalBalance()).toBe(50);
    });

    it("edit movement of cashOut player", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);
      table.cashOut("A", 0);

      table.deleteMovement(1);

      expect(table.players()).toEqual({ A: -100 });
      expect(table.getMovements()).toEqual(["A entró con 100"]);
      expect(table.totalBalance()).toBe(100);
    });
  });

  describe("calculate transfers", () => {
    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);
      table.cashOut("A", 100);

      expect(table.calculateTransfers()).toEqual([]);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "A", 100);
      table.addPlayer("B", "A", 50);
      table.cashOut("A", 100);

      expect(() => table.calculateTransfers()).toThrow(Table.balanceNotZeroError);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "alias.A", 100);
      table.addPlayer("B", "alias.B", 50);
      table.cashOut("A", 0);
      table.cashOut("B", 150);

      expect(table.calculateTransfers()).toEqual(["A le debe 100 a B (alias.B)"]);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "alias.A", 100);
      table.addPlayer("B", "alias.B", 100);
      table.cashOut("A", 50);
      table.cashOut("B", 150);

      expect(table.calculateTransfers()).toEqual(["A le debe 50 a B (alias.B)"]);
    });

    it("asd", () => {
      const table = new Table();
      table.addPlayer("A", "alias.A", 100);
      table.addPlayer("B", "alias.B", 100);
      table.cashOut("A", 100);
      table.cashOut("B", 100);

      expect(table.calculateTransfers()).toEqual([]);
    });

    it("uno le debe a varios", () => {
      const table = new Table();
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
      const table = new Table();
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
      const table = new Table();
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
      const table = new Table();
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
      const table = new Table();
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
      const table = new Table();
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
});
