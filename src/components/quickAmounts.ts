import type { QuickAmount } from "@/components/ui/form";
import type { PokerTable } from "@/models/table";

import { formatMoney } from "@/lib/utils";

/** Chips that add up: the usual buy-ins (20, 30, 50, 60 or 100 mil) take one or two taps. */
const chipAmounts: Array<QuickAmount> = [5000, 10000, 20000, 50000].map((value) => ({
  label: `${value / 1000} mil`,
  value,
  description: `Sumar ${formatMoney(value)}`,
}));

/** Leaving with everything that's left on the table. */
function wholePot(table: PokerTable): Array<QuickAmount> {
  const pot = table.totalBalance();

  return pot > 0
    ? [{ label: "Todo", value: pot, description: `Todo lo que queda: ${formatMoney(pot)}` }]
    : [];
}

export { chipAmounts, wholePot };
