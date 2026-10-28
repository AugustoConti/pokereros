import { cn } from "cn";

import { Chip, type ChipColor } from "./Chip";
import { Money } from "./Money";

import { formatMoney } from "@/lib/utils";

type Player = { name: string; balance: number; playing: boolean; color: ChipColor };

/** The felt seen from above: the pot in the middle and whoever is still playing around it. */
function FeltTable({
  pot,
  seated,
  large = false,
}: {
  pot: number;
  seated: Array<Player>;
  large?: boolean;
}) {
  // Past eight seats the balances would overlap each other; the players list still shows them.
  const showBalances = large && seated.length <= 8;

  return (
    <div
      className={cn(
        "relative rounded-full bg-rail shadow-[inset_0_0_0_2px_var(--color-primary),0_10px_24px_rgb(0_0_0/45%)]",
        large ? "mx-auto aspect-[3/2] w-full max-w-[calc((100dvh-16rem)*1.5)]" : "h-[230px]",
      )}
    >
      <div
        className={cn(
          "absolute rounded-full bg-felt bg-[radial-gradient(rgb(255_255_255/5%)_1px,transparent_1px)] bg-[length:4px_4px] shadow-[inset_0_0_30px_rgb(0_0_0/45%)]",
          large ? "inset-5" : "inset-3.5",
        )}
      >
        <div
          className={cn(
            "absolute rounded-full border border-brass-light/35",
            large ? "inset-6" : "inset-3.5",
          )}
        />
        <div className="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col items-center">
          <span className={cn("font-bold text-[#bfd6ca]", large ? "text-sm" : "text-xs")}>
            En la mesa
          </span>
          <span
            className={cn(
              "font-display leading-none font-extrabold text-ivory tabular-nums",
              large ? "text-[68px]" : "text-[40px]",
            )}
            data-testid="total-balance"
          >
            {formatMoney(pot)}
          </span>
        </div>
      </div>
      {seated.map((player, i) => {
        const angle = -Math.PI / 2 + (i / seated.length) * Math.PI * 2;

        return (
          <div
            key={player.name}
            aria-hidden="true"
            className="absolute flex -translate-1/2 flex-col items-center gap-0.5"
            data-testid={`seat-${player.name}`}
            style={{ left: `${50 + 46 * Math.cos(angle)}%`, top: `${50 + 44 * Math.sin(angle)}%` }}
          >
            <Chip
              className={large ? "size-[52px] text-2xl" : "size-[38px] text-lg"}
              color={player.color}
            >
              {player.name.charAt(0).toUpperCase()}
            </Chip>
            <span
              className={cn(
                "truncate font-extrabold text-ivory [text-shadow:0_1px_2px_rgb(0_0_0/80%)]",
                large ? "max-w-28 text-sm" : "max-w-20 text-xs",
              )}
            >
              {player.name}
            </span>
            {showBalances ? (
              <Money
                amount={player.balance}
                className="text-base [text-shadow:0_1px_2px_rgb(0_0_0/80%)]"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export { FeltTable, type Player };
