import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import appCss from "@/styles/globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pokereros" },
      {
        name: "description",
        content:
          "Gestiona entradas, recompras y salidas en tus juegos de póker de forma eficiente y calcula automáticamente las deudas entre jugadores.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo-black.ico", media: "(prefers-color-scheme: light)" },
      { rel: "icon", href: "/logo-white.ico", media: "(prefers-color-scheme: dark)" },
    ],
  }),
  shellComponent: RootLayout,
});

function RootLayout() {
  return (
    <html suppressHydrationWarning className="dark" lang="es">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Outlet />
        <TanStackDevtools
          plugins={[
            { name: "TanStack Router", render: <TanStackRouterDevtoolsPanel /> },
            formDevtoolsPlugin(),
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
