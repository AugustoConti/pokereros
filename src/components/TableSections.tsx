import type { Player } from "./FeltTable";
import type { PokerTable } from "@/models/table";

import { cn } from "cn";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

import AddPlayerForm from "./AddPlayerForm";
import CashOutForm from "./CashOutForm";
import { Chip } from "./Chip";
import DeleteMovementForm from "./DeleteMovementForm";
import EditMovementForm from "./EditMovementForm";
import { Money } from "./Money";
import ReBuyForm from "./ReBuyForm";

import { Button } from "@/components/ui/button";
import { useCopied } from "@/hooks/useCopied";
import { formatMoney } from "@/lib/utils";

function EmptyState({ children }: { children: string }) {
  return <p className="py-8 text-center text-[15px] text-muted-foreground">{children}</p>;
}

function PlayersTab({
  table,
  players,
  readOnly,
}: {
  table: PokerTable;
  players: Array<Player>;
  readOnly: boolean;
}) {
  if (players.length === 0) {
    return <EmptyState>Todavía no hay nadie en la mesa. Sumá al primer jugador.</EmptyState>;
  }

  return (
    <ul className="flex flex-col">
      {players.map((player) => (
        <li
          key={player.name}
          className="flex items-center gap-2.5 border-b py-2.5"
          data-testid={`player-${player.name}`}
        >
          <Chip className={cn("size-6", !player.playing && "opacity-40")} color={player.color} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="truncate text-base font-bold">{player.name}</span>
              <Money amount={player.balance} className="text-xl" />
            </div>
            <div className="text-xs text-muted-foreground">
              {player.playing ? "En juego" : "Se fue"}
            </div>
          </div>
          {readOnly ? null : player.playing ? (
            <div className="flex gap-1.5">
              <ReBuyForm player={player.name} table={table} />
              <CashOutForm player={player.name} table={table} />
            </div>
          ) : (
            <AddPlayerForm player={player.name} table={table} />
          )}
        </li>
      ))}
    </ul>
  );
}

function MovementsTab({ table, readOnly }: { table: PokerTable; readOnly: boolean }) {
  const movements = table.getMovements();

  if (movements.length === 0) {
    return <EmptyState>Todavía no hay movimientos.</EmptyState>;
  }

  return (
    <ol className="flex flex-col">
      {movements
        .map((movement, index) => ({ ...movement, index }))
        .reverse()
        .map((movement) => (
          <li key={movement.index} className="flex items-center gap-3 border-b py-1.5">
            <span
              aria-hidden="true"
              className={cn(
                "size-2.5 shrink-0 rounded-full",
                movement.amount < 0 ? "bg-ivory" : "bg-primary",
              )}
            />
            <span className="flex min-h-11 flex-1 items-center text-[15px]">
              {movement.description}
            </span>
            {readOnly ? null : (
              <div className="flex">
                <EditMovementForm
                  key={`${movement.index}-${movement.amount}`}
                  amount={movement.amount}
                  description={movement.description}
                  index={movement.index}
                  table={table}
                />
                <DeleteMovementForm
                  description={movement.description}
                  index={movement.index}
                  table={table}
                />
              </div>
            )}
          </li>
        ))}
    </ol>
  );
}

function ClosingTab({
  table,
  players,
  readOnly,
}: {
  table: PokerTable;
  players: Array<Player>;
  readOnly: boolean;
}) {
  const [paid, setPaid] = useState<ReadonlySet<string>>(new Set());
  const { copied, copy } = useCopied();
  const pot = table.totalBalance();

  if (players.length === 0) {
    return <EmptyState>Cuando haya jugadores, acá vas a ver quién le paga a quién.</EmptyState>;
  }

  if (pot !== 0) {
    const stillPlaying = players.filter((player) => player.playing);

    return (
      <div className="flex flex-col gap-3 pt-3.5">
        <p className="text-[15px] leading-relaxed text-[#d9e5de]">
          {pot > 0 ? (
            <>
              Quedan <strong className="text-ivory">{formatMoney(pot)}</strong> en la mesa. Las
              deudas se calculan cuando el pozo queda en $ 0.
            </>
          ) : (
            <>
              Se anotaron <strong className="text-ivory">{formatMoney(-pot)}</strong> más de lo que
              había en la mesa. Corregí los movimientos para que el pozo quede en $ 0.
            </>
          )}
        </p>
        {stillPlaying.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {stillPlaying.map((player) => (
              <li
                key={player.name}
                className="flex items-center gap-3 rounded-full bg-card py-2 pr-2 pl-3"
              >
                <Chip className="size-6" color={player.color} />
                <span className="flex-1 font-bold">{player.name}</span>
                {readOnly ? null : <CashOutForm player={player.name} table={table} />}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  const settlements = table.settlements();

  if (settlements.length === 0) {
    return <EmptyState>La mesa cerró y nadie le debe nada a nadie.</EmptyState>;
  }

  return (
    <div className="flex flex-col gap-2.5 pt-3.5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl font-extrabold text-brass-light">La mesa cerró</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            copy(
              settlements
                .map(
                  ({ from, to, alias, amount }) =>
                    `${from} le debe ${formatMoney(amount)} a ${to} (${alias})`,
                )
                .join("\n"),
            )
          }
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Copiadas" : "Copiar deudas"}
        </Button>
      </div>
      <ul className="flex flex-col gap-2.5">
        {settlements.map(({ from, to, alias, amount }) => {
          const key = `${from}>${to}`;
          const done = paid.has(key);

          return (
            <li
              key={key}
              className={cn(
                "flex flex-col gap-1.5 rounded-2xl bg-card px-4 py-3.5",
                done && "opacity-55",
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-bold">
                  {from} le paga a {to}
                </span>
                <span className="font-display text-[26px] font-extrabold text-ivory">
                  {formatMoney(amount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-muted-foreground">Alias {alias}</span>
                <Button
                  aria-pressed={done}
                  size="sm"
                  variant={done ? "default" : "outline"}
                  onClick={() =>
                    setPaid((current) => {
                      const next = new Set(current);

                      if (done) next.delete(key);
                      else next.add(key);

                      return next;
                    })
                  }
                >
                  {done ? "Pagado" : "Marcar pagado"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { ClosingTab, MovementsTab, PlayersTab };
