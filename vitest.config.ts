import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    coverage: {
      exclude: [
        "next-env.d.ts",
        "next.config.mjs",
        "postcss.config.mjs",
        "tailwind.config.ts",
        "src/app/layout.tsx",
        "src/lib/utils.ts",
      ],
    },
  },
});
