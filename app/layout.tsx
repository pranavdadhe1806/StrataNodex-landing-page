import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";

export const metadata: Metadata = {
  title: "StrataNodex — CLI-First Task Management for Developers",
  description:
    "Tree-based productivity system. CLI, web, and mobile — one account, infinite nesting, gamified scoring. Built for developers who think in layers.",
  keywords: [
    "task management",
    "CLI",
    "developer tools",
    "productivity",
    "terminal",
    "TUI",
  ],
  openGraph: {
    title: "StrataNodex — CLI-First Task Management",
    description:
      "Tree-based productivity. CLI-first. Infinite nesting. One ecosystem.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
