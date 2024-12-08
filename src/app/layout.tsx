import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "../styles/globals.css";
import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// eslint-disable-next-line import/no-unused-modules
export const metadata: Metadata = {
  title: "Pokereros",
  description:
    "Gestiona entradas, recompras y salidas en tus juegos de póker de forma eficiente y calcula automaticamente las deudas entre jugadores.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo-black.ico",
        href: "/logo-black.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-white.ico",
        href: "/logo-white.ico",
      },
    ],
  },
};

// eslint-disable-next-line import/no-unused-modules
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="es">
      <body className={cn("dark min-h-screen bg-background font-sans antialiased", inter.variable)}>
        {children}
      </body>
    </html>
  );
}
