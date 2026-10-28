import { cn } from "cn";

import { formatMoney } from "@/lib/utils";

/** A player's balance: ivory when they're up, red when they're down. */
function Money({ amount, className }: { amount: number; className?: string }) {
  return (
    <span
      className={cn(
        "font-display font-extrabold tabular-nums",
        amount > 0 ? "text-ivory" : amount < 0 ? "text-loss" : "text-muted-foreground",
        className,
      )}
    >
      {amount > 0 ? "+" : ""}
      {formatMoney(amount)}
    </span>
  );
}

export { Money };
