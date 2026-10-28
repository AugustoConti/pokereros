import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "cn";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/manos")({
  component: Hands,
});

type Hand = {
  name: string;
  description: string;
  cards: Array<string>;
  // How many cards at the end don't make the hand and only break ties.
  kickers?: number;
};

const hands: Array<Hand> = [
  {
    name: "Escalera real",
    description: "A, K, Q, J y 10 del mismo palo",
    cards: ["A♥", "K♥", "Q♥", "J♥", "10♥"],
  },
  {
    name: "Escalera de color",
    description: "Cinco cartas seguidas del mismo palo",
    cards: ["K♠", "Q♠", "J♠", "10♠", "9♠"],
  },
  {
    name: "Póker",
    description: "Cuatro cartas del mismo valor",
    cards: ["A♥", "A♣", "A♦", "A♠", "K♦"],
    kickers: 1,
  },
  {
    name: "Full",
    description: "Un trío y un par",
    cards: ["10♣", "10♦", "10♠", "J♥", "J♣"],
  },
  {
    name: "Color",
    description: "Cinco cartas del mismo palo",
    cards: ["A♠", "Q♠", "10♠", "8♠", "5♠"],
  },
  {
    name: "Escalera",
    description: "Cinco cartas seguidas de cualquier palo",
    cards: ["7♠", "6♦", "5♥", "4♦", "3♠"],
  },
  {
    name: "Trío",
    description: "Tres cartas del mismo valor",
    cards: ["Q♥", "Q♣", "Q♦", "8♠", "7♦"],
    kickers: 2,
  },
  {
    name: "Doble par",
    description: "Dos pares distintos",
    cards: ["9♦", "9♠", "4♥", "4♣", "K♣"],
    kickers: 1,
  },
  {
    name: "Par",
    description: "Dos cartas del mismo valor",
    cards: ["8♣", "8♦", "5♠", "3♣", "2♥"],
    kickers: 3,
  },
  {
    name: "Carta alta",
    description: "Sin juego: gana la carta más alta",
    cards: ["Q♥", "9♠", "7♥", "6♣", "3♦"],
    kickers: 4,
  },
];

function Card({ card, kicker }: { card: string; kicker: boolean }) {
  const rank = card.slice(0, -1);
  const suit = card.slice(-1);
  const red = suit === "♥" || suit === "♦";

  return (
    <div
      className={cn(
        "flex h-14 w-10 flex-col items-center justify-center rounded-md bg-white leading-none font-bold shadow-md",
        red ? "text-red-600" : "text-slate-900",
        kicker && "opacity-40",
      )}
    >
      <span className="text-lg">{rank}</span>
      <span className="text-xl">{suit}</span>
    </div>
  );
}

function Hands() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-3 pb-8">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-brass-light">Ranking de manos</h1>
        <Button asChild size="icon" variant="ghost">
          <Link aria-label="Volver a la mesa" title="Volver a la mesa" to="/">
            <X className="size-5" />
          </Link>
        </Button>
      </header>
      <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {hands.map(({ name, description, cards, kickers = 0 }, index) => (
          <li key={name} className="space-y-2">
            <div>
              <h2 className="font-semibold">
                <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                {name}
              </h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div aria-label={cards.join(" ")} className="flex gap-1.5" role="img">
              {cards.map((card, cardIndex) => (
                <Card key={card} card={card} kicker={cardIndex >= cards.length - kickers} />
              ))}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted-foreground">
        Las cartas atenuadas no forman la mano: solo desempatan.
      </p>
    </main>
  );
}
