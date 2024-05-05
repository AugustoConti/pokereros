import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "../styles/globals.css";
import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// eslint-disable-next-line import/no-unused-modules
export const metadata: Metadata = {
  title: "Pokereros",
  description: "",
};

// eslint-disable-next-line import/no-unused-modules
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        {children}
      </body>
    </html>
  );
}
