"use client";

import {
  Check,
  ChevronDown,
  CircleDotDashed,
  Copy,
  Club,
  Diamond,
  Heart,
  Spade,
  Link as LinkIcon,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";

import DeleteMovementForm from "@/app/DeleteMovementForm";
import EditMovementForm from "@/app/EditMovementForm";
import ResetTableForm from "@/app/ResetTableForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, formatMoney } from "@/lib/utils";
import { Table, type PokerTable } from "@/models/table";

import AddPlayerForm from "./AddPlayerForm";
import CashOutForm from "./CashOutForm";
import ReBuyForm from "./ReBuyForm";

function GitHub() {
  return (
    <svg className="size-6 text-white" role="img" viewBox="0 0 24 24">
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        fill="currentColor"
      />
    </svg>
  );
}

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
  const tableUrl = () => `${window.location.origin}/${table.getId()}`;

  const router = useRouter();
  const pushToHome = () => router.push("/");

  const [showQRLink, setShowQRLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const handleShareLink = () => {
    void navigator.clipboard.writeText(tableUrl());
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
  const movements = table.getMovements();

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
        <header className="flex flex-col items-center justify-between space-y-2 sm:flex-row">
          <h1 className="text-2xl font-semibold">
            <Spade className="mr-2 inline-block h-6 w-6" fill="currentColor" />
            Pokereros
          </h1>
          <div className="flex space-x-2">
            <Dialog open={showQRLink} onOpenChange={setShowQRLink}>
              <DialogTrigger asChild>
                <Button size="icon" title="Compartir enlace de invitación" variant="outline">
                  <QrCode />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>🫂 Compartir mesa</DialogTitle>
                </DialogHeader>
                <div className="my-4 flex flex-col items-center">
                  <img
                    alt="QR"
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${tableUrl()}`}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button
              size="icon"
              title="Compartir enlace de invitación"
              variant="outline"
              onClick={handleShareLink}
            >
              {!linkCopied ? (
                <LinkIcon className="text-violet-500" />
              ) : (
                <Check className="text-green-500" />
              )}
            </Button>
            <a
              className="flex items-center rounded border border-input px-1.5 text-gray-500 hover:bg-gray-800"
              href="https://github.com/AugustoConti/pokereros"
            >
              <GitHub />
            </a>
            <Link
              className="flex items-center rounded border border-input px-1.5 hover:bg-gray-800"
              href="./manos"
            >
              <div>
                <Heart className="size-3 text-red-500" fill="currentColor" />
                <Diamond className="size-3 text-blue-500" fill="currentColor" />
              </div>
              <div>
                <Club className="size-3 text-green-500" fill="currentColor" />
                <Spade className="size-3 text-white" />
              </div>
            </Link>
            <Link
              className="flex items-center rounded border border-input px-1.5 hover:bg-gray-800"
              href="./fichas"
            >
              <CircleDotDashed className="text-amber-500" />
            </Link>
          </div>
        </header>
        <div className="grid gap-3 md:grid-cols-2">
          <Section
            button={<ResetTableForm resetTable={!readOnly ? resetTable : pushToHome} />}
            title="☠️ Jugadores"
          >
            {players.length > 0 ? (
              players.map(([player, balance]) => (
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
              ))
            ) : (
              <p className="py-3 text-center text-gray-500">No hay víctimas</p>
            )}
          </Section>
          <Section title="📝 Logs">
            {movements.length > 0 ? (
              movements.map((movement, i) => (
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
              ))
            ) : (
              <p className="py-3 text-center text-gray-500">No hay logs</p>
            )}
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

function TableFromObject({ tableData }: { tableData: Record<string, unknown> }) {
  const table = Table.fromJSON(tableData, formatMoney);

  return <TableComponent table={table} />;
}

export { TableFromObject };
export default TableComponent;
