import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, RotateCcw, Paintbrush, X, PlusIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Chip, chipColors } from "@/components/Chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/fichas")({
  component: ChipsPage,
});

type Chip = {
  value: number;
  color: string;
};

const chipsSchema = z.array(
  z.object({ value: z.number(), color: z.string(), count: z.number().optional() }),
);

type ChipCount = z.infer<typeof chipsSchema>[number];

// The same chip colors as the table: white, blue, red, green and black.
const defaultChipConfigs = [
  { value: 300, color: "#f5f5f2" },
  { value: 600, color: "#1f4fa3" },
  { value: 1500, color: "#c8102e" },
  { value: 3000, color: "#2e7d4f" },
  { value: 7500, color: "#17171a" },
] satisfies Array<Chip>;

// Colors this page used to save by default, so chips stored before keep matching the new palette.
const previousDefaults: Record<string, string> = {
  "#ffffff": "#f5f5f2",
  "#0074d9": "#1f4fa3",
  "#ff4136": "#c8102e",
  "#2ecc40": "#2e7d4f",
  "#000000": "#17171a",
  "#ffd700": "#f2a900",
};

function PokerChip({
  value,
  color,
  count,
  onValueChange,
  onColorChange,
  onCountChange,
  onDelete,
}: {
  value: number;
  color: string;
  count: number;
  onValueChange: (newValue: number) => void;
  onColorChange: (newColor: string) => void;
  onCountChange: (newCount: number) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        aria-label={`Quitar la ficha de ${value}`}
        size="icon"
        variant="ghost"
        onClick={onDelete}
      >
        <X className="size-4" />
      </Button>
      <Chip className="size-[104px] flex-col gap-1 border-[5px]" color={color}>
        <input
          aria-label="Valor de la ficha"
          className="w-20 rounded bg-transparent text-center font-display text-[26px] leading-none font-extrabold text-inherit tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-current"
          inputMode="numeric"
          type="text"
          value={value.toLocaleString("es-AR")}
          onChange={(e) => onValueChange(Number(e.target.value.replace(/\D/gu, "").slice(0, 9)))}
        />
        <label
          className="relative flex size-6 cursor-pointer items-center justify-center rounded-full focus-within:ring-2 focus-within:ring-current"
          title="Cambiar color"
        >
          <Paintbrush aria-hidden="true" className="size-4" />
          <input
            aria-label={`Color de la ficha de ${value}`}
            className="absolute inset-0 cursor-pointer opacity-0"
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
          />
        </label>
      </Chip>
      <Button
        aria-label={`Una ficha de ${value} menos`}
        className="ml-2 h-14 rounded-l-full rounded-r-none"
        size="icon"
        variant="outline"
        onClick={() => onCountChange(Math.max(0, count - 1))}
      >
        <Minus className="size-4" />
      </Button>
      <Input
        aria-label={`Cantidad de fichas de ${value}`}
        className="h-14 w-16 rounded-none border-x-0 border-y-[1.5px] border-primary bg-transparent text-center font-display text-2xl font-extrabold tabular-nums dark:bg-transparent"
        min="0"
        type="number"
        value={count || ""}
        onChange={(e) => onCountChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
      />
      <Button
        aria-label={`Una ficha de ${value} más`}
        className="h-14 rounded-l-none rounded-r-full"
        size="icon"
        variant="outline"
        onClick={() => onCountChange(count + 1)}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}

const getInitialChips = (): Array<ChipCount> => {
  try {
    const stored = chipsSchema.safeParse(JSON.parse(localStorage.getItem("chips") ?? "[]"));

    return stored.success && stored.data.length > 0
      ? stored.data.map((chip) => ({
          ...chip,
          color: previousDefaults[chip.color.toLowerCase()] ?? chip.color,
        }))
      : defaultChipConfigs.map((c) => ({ ...c, count: 0 }));
  } catch {
    return defaultChipConfigs.map((c) => ({ ...c, count: 0 }));
  }
};

function ChipsPage() {
  const [chips, setChips] = useState(getInitialChips);
  const [bbValue, setBbValue] = useState(() => {
    try {
      const stored = localStorage.getItem("bbValue");

      return stored ? parseInt(stored, 10) : 600;
    } catch {
      return 600;
    }
  });

  const saveChips = (newChips: typeof chips) => {
    localStorage.setItem("chips", JSON.stringify(newChips));
    setChips(newChips);
  };

  const saveBbValue = (newBb: number) => {
    localStorage.setItem("bbValue", newBb.toString());
    setBbValue(newBb);
  };

  const addChip = () => {
    const color =
      chipColors.find((option) => !chips.some((chip) => chip.color === option)) ?? chipColors[0];

    saveChips([...chips, { value: 10000, color, count: 0 }]);
  };

  const total = chips.reduce((sum, chip) => sum + chip.value * (chip.count ?? 0), 0);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center px-5 pb-8">
      <header className="flex w-full items-center justify-between py-3">
        <h1 className="font-display text-2xl font-extrabold text-brass-light">
          Contador de fichas
        </h1>
        <Button asChild size="icon" variant="ghost">
          <Link aria-label="Volver a la mesa" title="Volver a la mesa" to="/">
            <X className="size-5" />
          </Link>
        </Button>
      </header>
      <div className="flex flex-col gap-4 pt-2">
        {chips.map((chip, index) => (
          <PokerChip
            key={index}
            color={chip.color}
            count={chip.count ?? 0}
            value={chip.value}
            onColorChange={(newColor) => {
              const newChips = [...chips];

              newChips[index] = { ...chip, color: newColor };
              saveChips(newChips);
            }}
            onCountChange={(newCount) => {
              const newChips = [...chips];

              newChips[index] = { ...chip, count: newCount };
              saveChips(newChips);
            }}
            onDelete={() => {
              const newChips = chips.filter((_, i) => i !== index);

              saveChips(newChips);
            }}
            onValueChange={(newValue) => {
              const newChips = [...chips];

              newChips[index] = { ...chip, value: newValue };
              saveChips(newChips);
            }}
          />
        ))}
      </div>
      <Button aria-label="Agregar ficha" className="my-4" variant="outline" onClick={addChip}>
        <PlusIcon className="size-4" />
      </Button>
      <div className="mt-3 flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
          <p className="font-display text-5xl font-extrabold text-ivory tabular-nums">
            {formatMoney(total)}
          </p>
          <Button
            aria-label="Poner todo en cero"
            size="icon"
            variant="outline"
            onClick={() => saveChips(chips.map((c) => ({ ...c, count: 0 })))}
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <span>BB:</span>
          <Input
            className="text-md w-24 text-center"
            type="number"
            value={bbValue}
            onChange={(e) => saveBbValue(Math.max(0, parseInt(e.target.value, 10) || 600))}
          />
          <p className="text-lg font-bold">= {Math.round((total / bbValue) * 100) / 100} BB</p>
        </div>
      </div>
    </main>
  );
}
