import type { ComponentProps } from "react";

import { cn } from "cn";

// Colors of real chip sets, used to tell players apart and for quick amounts. The first four are the
// classic denominations; the order keeps neighbors at the table looking different.
const chipColors = [
  "#c8102e", // red
  "#1f4fa3", // blue
  "#17171a", // black
  "#f5f5f2", // white
  "#2e7d4f", // green
  "#f2a900", // yellow
  "#6b3fa0", // purple
  "#4fc3e0", // light blue
  "#8a5a2b", // brown
  "#f48fb1", // pink
  "#e8702a", // orange
  "#7d8590", // gray
] as const;

type ChipColor = (typeof chipColors)[number];

function chipColorAt(index: number): ChipColor {
  return chipColors[index % chipColors.length] ?? chipColors[0];
}

/** Relative luminance (WCAG) of a `#rrggbb` color, to pick a readable letter on the chip. */
function luminance(color: string) {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((start) => {
    const channel = parseInt(color.slice(start, start + 2), 16) / 255;

    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Dark letters read better from this luminance up (the point where both contrasts are equal).
const isLight = (color: string) => luminance(color) > 0.179;
// White chips keep the red edge marks real ones have.
const isWhite = (color: string) => luminance(color) > 0.8;

/** A poker chip: a disc with a dashed inner edge and a brass ring. */
function Chip({ color, className, style, ...props }: ComponentProps<"span"> & { color: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border-[3px] border-dashed font-display font-extrabold shadow-[0_0_0_1.5px_var(--color-primary)]",
        isLight(color) ? "text-[#17171a]" : "border-[#f5f5f2] text-[#f5f5f2]",
        isLight(color) && (isWhite(color) ? "border-[#c8102e]" : "border-[#17171a]/60"),
        className,
      )}
      style={{ backgroundColor: color, ...style }}
      {...props}
    />
  );
}

export { Chip, chipColorAt, chipColors, type ChipColor };
