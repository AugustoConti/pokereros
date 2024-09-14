"use client";

import {
  Check,
  ChevronDown,
  CircleDotDashed,
  Copy,
  Heart,
  Spade,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

import DeleteMovementForm from "@/app/DeleteMovementForm";
import EditMovementForm from "@/app/EditMovementForm";
import ResetTableForm from "@/app/ResetTableForm";
import { Button } from "@/components/ui/button";
import { cn, formatMoney } from "@/lib/utils";
import { Table, type PokerTable } from "@/models/table";

import AddPlayerForm from "./AddPlayerForm";
import CashOutForm from "./CashOutForm";
import ReBuyForm from "./ReBuyForm";

function TableBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-[calc(100vh-3rem)] items-center justify-center bg-gray-700 shadow-inner">
      <div className="absolute h-[calc(100vh-3rem)] w-screen bg-[url('/poker_icons.png')] shadow-[inset_0_0_200px_70px_rgba(0,0,0,0.5)]" />
      <div className="relative h-3/4 w-3/4 rounded-full bg-gray-700 shadow-[inset_0_0_13px_13px_rgb(0,0,0)]">
        <div className="absolute left-1/2 top-1/2 flex h-[calc(100%-5rem)] w-[calc(100%-5rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-green-700 shadow-[0_0_13px_13px_rgb(0,0,0),_inset_0_0_13px_13px_rgba(0,0,0,0.3)]">
          <div className="h-[calc(100%-3rem)] w-[calc(100%-3rem)] rounded-full border-2 border-gray-300" />
        </div>
      </div>
      <ul className="absolute flex h-full w-full items-center justify-center text-center">
        {children}
      </ul>
      <ChevronDown className="absolute bottom-0 left-1/2 h-10 w-10 -translate-x-1/2 transform text-gray-500" />
    </div>
  );
}

function PlayerBalance({ balance }: { balance: number }) {
  return (
    <p
      className={balance === 0 ? "text-gray-500" : balance >= 0 ? "text-green-500" : "text-red-500"}
    >
      {formatMoney(balance)}
    </p>
  );
}

const getSeatPosition = (i: number, total: number) => {
  const top = 50 + 40 * Math.sin((i / total) * 2 * Math.PI);
  const left = 50 + 40 * Math.cos((i / total) * 2 * Math.PI);
  const calc = (value: number) =>
    `calc(${value}% + ${value === 10 ? 40 : value === 90 ? -40 : 0}px)`;

  return { top: calc(top), left: calc(left) };
};

function Seat({
  i,
  total,
  player,
  balance,
  table,
  readOnly,
}: {
  i: number;
  total: number;
  player: string;
  balance: number;
  table: PokerTable;
  readOnly: boolean;
}) {
  return (
    <div
      className={`absolute max-w-40 -translate-x-1/2 -translate-y-1/2 space-y-2 rounded-md bg-black/30 px-4 py-3 shadow backdrop-blur-lg`}
      data-testid={`seat-${player}`}
      style={getSeatPosition(i, total)}
    >
      <p className="break-words text-sm">{player}</p>
      <PlayerBalance balance={balance} />
      {!readOnly ? (
        <div className="flex justify-center space-x-1">
          <ReBuyForm player={player} table={table} />
          <CashOutForm player={player} table={table} />
        </div>
      ) : null}
    </div>
  );
}

function Section({
  title,
  children,
  button,
}: {
  title: ReactNode;
  children: ReactNode;
  button?: ReactNode;
}) {
  return (
    <section className="space-y-1 rounded-md border border-gray-500 p-2">
      <div className="flex items-center justify-between border-b pb-1">
        <h2 className={cn("font-semibold", !button && "py-2")}>{title}</h2>
        {button}
      </div>
      <ul className="space-y-1">{children}</ul>
    </section>
  );
}

function TableComponent({ table, resetTable }: { table: PokerTable; resetTable?: () => void }) {
  const players = Object.entries(table.players());
  const playersInGame = players.filter(([player]) => table.isInGame(player));
  const readOnly = !resetTable;

  const [linkCopied, setLinkCopied] = useState(false);
  const handleShareLink = () => {
    void navigator.clipboard.writeText(`${window.location.origin}/${table.getId()}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const [copyTransfersReady, setCopyTransfersReady] = useState(false);
  const handleCopyTransfers = () => {
    void navigator.clipboard.writeText(table.calculateTransfers().join("\n"));
    setCopyTransfersReady(true);
    setTimeout(() => setCopyTransfersReady(false), 2000);
  };

  const showDebts = table.totalBalance() === 0 && table.calculateTransfers().length > 0;

  return (
    <main>
      <TableBackground>
        <div className="min-w-40 space-y-2 rounded-md bg-black/30 px-4 py-3 shadow backdrop-blur-lg">
          <p className="text-2xl font-bold" data-testid="total-balance">
            {formatMoney(table.totalBalance())}
          </p>
          {!readOnly ? <AddPlayerForm table={table} /> : null}
        </div>
        {playersInGame.map(([player, balance], i, arr) => (
          <Seat
            key={player}
            balance={balance}
            i={i}
            player={player}
            readOnly={readOnly}
            table={table}
            total={arr.length}
          />
        ))}
      </TableBackground>
      <div className="space-y-4 p-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            <Spade className="mr-2 inline-block h-6 w-6" fill="currentColor" />
            Pokereros
          </h1>
          <div className="flex space-x-2">
            <Button
              size="icon"
              title="Compartir enlace de invitación"
              variant="outline"
              onClick={handleShareLink}
            >
              {!linkCopied ? (
                <LinkIcon className="h-4 w-4 text-violet-500" />
              ) : (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </Button>
            <Link
              className="flex items-center rounded border border-input p-1 text-amber-500 hover:bg-gray-800"
              href="./fichas"
            >
              <CircleDotDashed />
            </Link>
            <Link
              className="flex items-center rounded border border-input p-1 text-rose-500 hover:bg-gray-800"
              href="./manos"
            >
              <span className="text-xl font-bold">A</span>
              <Heart fill="currentColor" />
            </Link>
          </div>
        </header>
        <div className="grid gap-3 md:grid-cols-2">
          <Section
            button={!readOnly ? <ResetTableForm resetTable={resetTable} /> : null}
            title="☠️ Jugadores"
          >
            {players.map(([player, balance]) => (
              <div
                key={player}
                className="flex items-center justify-between space-x-4"
                data-testid={`player-${player}`}
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  {!readOnly && !table.isInGame(player) ? (
                    <AddPlayerForm balance={balance} player={player} table={table} />
                  ) : null}
                  <p>{player}</p>
                </div>
                <PlayerBalance balance={balance} />
              </div>
            ))}
          </Section>
          <Section title="📝 Logs">
            {table.getMovements().map((movement, i) => (
              <li key={i} className="flex items-center justify-between space-x-4">
                <p className="flex-1 overflow-hidden">{movement.description}</p>
                {!readOnly ? (
                  <div className="space-x-1">
                    <EditMovementForm
                      key={`${i}-${movement.amount}`}
                      index={i}
                      table={table}
                      {...movement}
                    />
                    <DeleteMovementForm index={i} table={table} {...movement} />
                  </div>
                ) : null}
              </li>
            ))}
          </Section>
          {showDebts ? (
            <Section
              button={
                <Button size="icon" variant="outline" onClick={handleCopyTransfers}>
                  {!copyTransfersReady ? (
                    <Copy className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </Button>
              }
              title="🤑 Deudas"
            >
              {table.calculateTransfers().map((transfer, i) => (
                <li key={i} className="flex items-center justify-between">
                  <p>{transfer}</p>
                </li>
              ))}
            </Section>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function TableFromObject({ tableData }: { tableData: unknown }) {
  const table = Table.fromJSON(tableData, formatMoney);

  return <TableComponent table={table} />;
}

export { TableFromObject };
export default TableComponent;
