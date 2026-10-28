import { describe, expect, it } from "vitest";

import { chipColorAt } from "./Chip";

describe("chip colors", () => {
  it("gives the first ten players different colors", () => {
    const colors = Array.from({ length: 10 }, (_, index) => chipColorAt(index));

    expect(new Set(colors).size).toBe(10);
  });

  it("starts over once every color is used", () => {
    expect(chipColorAt(12)).toBe(chipColorAt(0));
  });
});
