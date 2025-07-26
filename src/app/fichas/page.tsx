"use client";
import { Minus, Plus, RotateCcw, Paintbrush, X, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/utils";

type Chip = {
  value: number;
  color: string;
};

type ChipCount = Chip & {
  count?: number;
};

const defaultChipConfigs = [
  { value: 300, color: "#ffffff" },
  { value: 600, color: "#0074D9" },
  { value: 1500, color: "#FF4136" },
  { value: 3000, color: "#2ECC40" },
  { value: 7500, color: "#000000" },
] satisfies Chip[];

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
  const border = color === "#ffffff" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";
  const fill = color === "#ffffff" ? "#000000" : "#ffffff";

  return (
    <div className="flex items-center">
      <div>
        <Button className="h-14 w-14" size="icon" variant="link" onClick={onDelete}>
          <X className="size-4" />
        </Button>
      </div>
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
        <foreignObject height="30" width="80" x="15" y="25">
          <input
            style={{
              width: "100%",
              height: "100%",
              textAlign: "center",
              fontSize: "20px",
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              color: fill,
              background: "transparent",
            }}
            type="number"
            value={value}
            onChange={(e) => onValueChange(Math.max(0, parseInt(e.target.value) || 0))}
          />
        </foreignObject>
        <foreignObject height="22" width="22" x="40" y="55">
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Paintbrush color={fill} size={18} style={{ cursor: "pointer" }} />
            <input
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
            />
          </div>
        </foreignObject>
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

const getInitialChips = (): ChipCount[] => {
  try {
    const stored = JSON.parse(localStorage.getItem("chips") ?? "[]");

    return Array.isArray(stored) && stored.length > 0
      ? stored
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

      return stored ? parseInt(stored) : 600;
    } catch {
      return 600;
    }
  });

  useEffect(() => {
    setChips(getInitialChips());
    const storedBb = localStorage.getItem("bbValue");

    if (storedBb) setBbValue(parseInt(storedBb));
  }, []);

  const saveChips = (newChips: typeof chips) => {
    localStorage.setItem("chips", JSON.stringify(newChips));
    setChips(newChips);
  };

  const saveBbValue = (newBb: number) => {
    localStorage.setItem("bbValue", newBb.toString());
    setBbValue(newBb);
  };

  const addChip = () => {
    saveChips([...chips, { value: 10000, color: "#FFD700", count: 0 }]);
  };

  const total = chips.reduce((sum, chip) => sum + chip.value * (chip.count ?? 0), 0);

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-800">
      <Link
        className="absolute right-0 float-end m-3 rounded-full border border-white p-1"
        href="/"
      >
        <X className="size-5" />
      </Link>
      <div className="mt-10">
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
      <Button className="my-4" variant="outline" onClick={addChip}>
        <PlusIcon className="size-4" />
      </Button>
      <div className="mt-3 flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
          <p className="text-4xl font-bold text-white">{formatMoney(total)}</p>
          <Button
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
            onChange={(e) => saveBbValue(Math.max(0, parseInt(e.target.value) || 600))}
          />
          <p className="text-lg font-bold">= {Math.round((total / bbValue) * 100) / 100} BB</p>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-unused-modules
export default ChipsPage;
