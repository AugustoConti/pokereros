import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

import "@/lib/zod";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: () => <div className="p-4">Página no encontrada</div>,
  });
}
