/*
 * ════════════════════════════════════════════════════════════════════════════
 * FILE: app/layout.tsx
 * ════════════════════════════════════════════════════════════════════════════
 * WHAT IT DOES:
 *   The root wrapper rendered around every single page on the site.
 *   Loads the Inter font (fallback), injects globals.css, and sets the
 *   browser tab title and description.
 *
 * 🎨 DESIGN — things to edit here:
 *   - `inter` font config   → change subset, variable name, or swap for
 *                             another Google Font if needed as fallback
 *   - `<html>` className    → add dark mode class or global layout classes
 *   - `<body>` className    → change base background, text color, or font
 *
 * ✏️  CONTENT — things to edit here:
 *   - `metadata.title`       → browser tab title
 *   - `metadata.description` → SEO description shown in search results
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-2BCKFFGVNL";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const migra = localFont({
  src: [
    { path: "../public/fonts/Migra-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Migra-Extrabold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-migra",
  display: "swap",
});

const telegraf = localFont({
  src: [
    { path: "../public/fonts/Telegraf-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Telegraf-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-telegraf",
  display: "swap",
});

const BASE_URL = "https://www.jfcr.design";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "JFCR — Juan Felipe Cadavid Rojas",
    template: "%s — JFCR",
  },
  description: "A digital designer focused on exceptional products, brands and sometimes silly animations.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "JFCR",
    title: "JFCR — Juan Felipe Cadavid Rojas",
    description: "A digital designer focused on exceptional products, brands and sometimes silly animations.",
    url: BASE_URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JFCR — Juan Felipe Cadavid Rojas",
    description: "A digital designer focused on exceptional products, brands and sometimes silly animations.",
    images: ["/og-image.png"],
  },
  other: {
    "viewport": "width=device-width, initial-scale=1, viewport-fit=cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${migra.variable} ${telegraf.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
      </body>
    </html>
  );
}
