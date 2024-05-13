import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/__tests__/setup.ts",
    coverage: {
      exclude: [
        ".next",
        "next-env.d.ts",
        "next.config.mjs",
        "postcss.config.mjs",
        "tailwind.config.ts",
        "src/app",
        "src/lib",
        "src/components",
      ],
    },
  },
});
