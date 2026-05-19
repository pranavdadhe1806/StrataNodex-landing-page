import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";

export const metadata: Metadata = {
  title: "StrataNodex — Open Source Task Management for Developers",
  description:
    "Tree-based productivity across CLI, web, and mobile — one account, infinite nesting, gamified scoring. Open source and built for developers.",
  keywords: [
    "task management",
    "CLI",
    "developer tools",
    "productivity",
    "open source",
    "terminal",
  ],
  openGraph: {
    title: "StrataNodex — Open Source Task Management",
    description:
      "Tree-based productivity. CLI, web, mobile. Infinite nesting. One ecosystem. Open source.",
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
