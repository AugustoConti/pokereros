import type { PluginOption } from "vite";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vitest/config";

function nitroPlugin(): PluginOption {
  return nitro({
    hooks: {
      // Wrap Nitro's onwarn to also ignore the RSC directives ("use client") libraries ship.
      "rollup:before": (_nitro, config) => {
        const { onwarn } = config;

        Object.assign(config, {
          onwarn: (...[warning, warn]: Parameters<NonNullable<typeof onwarn>>) => {
            if (warning.code !== "MODULE_LEVEL_DIRECTIVE") onwarn?.(warning, warn);
          },
        });
      },
    },
  });
}

function appPlugins(mode: string): Array<PluginOption> {
  return [
    ...(mode === "test"
      ? []
      : [devtools(), tanstackStart({ spa: { enabled: true } }), nitroPlugin()]),
    react(),
    tailwindcss(),
  ];
}

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: appPlugins(mode),
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    watch: false,
    coverage: {
      include: ["src/models/**"],
    },
  },
}));
