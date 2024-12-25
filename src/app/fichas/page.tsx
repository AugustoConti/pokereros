"use client";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/utils";

function PokerChip({
  value,
  color,
  count,
  onCountChange,
}: {
  value: number;
  color: string;
  count: number;
  onCountChange: (newCount: number) => void;
}) {
  const border = color === "white" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";
  const borderInvert = color === "white" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const fill = color === "white" ? "black" : "white";

  return (
    <div className="flex items-center">
      <svg className="flex-shrink-0" height="120" viewBox="0 0 100 100" width="120">
        <circle cx="50" cy="52" fill="rgba(0,0,0,0.2)" r="45" />
        <circle cx="50" cy="50" fill={color} r="45" />
        <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        {[...Array(18)].map((_, i) => (
          <line
            key={i}
            stroke={border}
            strokeWidth="1"
            transform={`rotate(${i * 20} 50 50)`}
            x1="50"
            x2="50"
            y1="5"
            y2="15"
          />
        ))}
        <circle cx="50" cy="50" fill="none" r="38" stroke={border} strokeWidth="2" />
        <text
          fill={fill}
          fontFamily="Arial, sans-serif"
          fontSize="20"
          fontWeight="bold"
          stroke={borderInvert}
          strokeWidth="1"
          textAnchor="middle"
          x="50"
          y="55"
        >
          {value}
        </text>
      </svg>
      <Button
        aria-label={`Decrease ${value} chip count`}
        className="ml-4 h-14 rounded-l-full"
        size="icon"
        variant="outline"
        onClick={() => onCountChange(Math.max(0, count - 1))}
      >
        <Minus className="size-4" />
      </Button>
      <Input
        aria-label={`${value} chip count`}
        className="h-14 w-16 rounded-none text-center text-xl"
        min="0"
        type="number"
        value={count || ""}
        onChange={(e) => onCountChange(Math.max(0, parseInt(e.target.value) || 0))}
      />
      <Button
        aria-label={`Increase ${value} chip count`}
        className="h-14 rounded-r-full"
        size="icon"
        variant="outline"
        onClick={() => onCountChange(count + 1)}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}

const chips = [
  { value: 300, color: "white" },
  { value: 600, color: "#0074D9" },
  { value: 1500, color: "#FF4136" },
  { value: 3000, color: "#2ECC40" },
  { value: 7500, color: "black" },
] as const;

const bbValue = chips[1].value;

const initialChips = Object.fromEntries(chips.map(({ value }) => [value, 0]));

type Chips = typeof initialChips;

const getInitialChips = () => {
  try {
    const chips: Chips = JSON.parse(localStorage.getItem("chips") ?? "{}");

    return { ...initialChips, ...chips };
  } catch {
    return initialChips;
  }
};

function ChipsPage() {
  const [chipCounts, setChipCounts] = useState(initialChips);

  useEffect(() => setChipCounts(getInitialChips()), []);

  const saveChips = (chips: Chips) => {
    localStorage.setItem("chips", JSON.stringify({ ...chipCounts, ...chips }));
    setChipCounts({ ...chipCounts, ...chips });
  };

  const total = Object.entries(chipCounts).reduce(
    (sum, [value, count]) => sum + parseInt(value) * count,
    0,
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-700">
      <Link
        className="absolute right-0 float-end m-3 rounded-full border border-white p-1"
        href="/"
      >
        <X className="size-5" />
      </Link>
      {chips.map((chip) => (
        <PokerChip
          key={chip.value}
          color={chip.color}
          count={chipCounts[chip.value] ?? 0}
          value={chip.value}
          onCountChange={(newCount) => saveChips({ [chip.value]: newCount })}
        />
      ))}
      <div className="mt-6 flex items-center space-x-4">
        <div className="flex flex-col items-center font-bold">
          <p className="text-4xl font-bold text-white">{formatMoney(total)}</p>
          <p className="text-lg">{Math.round((total / bbValue) * 100) / 100} BB</p>
        </div>
        <Button size="icon" variant="outline" onClick={() => saveChips(initialChips)}>
          <RotateCcw className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-unused-modules
export default ChipsPage;
