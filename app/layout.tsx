import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: {
    default: "Uppercat — Creative Developer",
    template: "%s — Uppercat",
  },
  description:
    "Portafolio experimental de desarrollo creativo. Experiencias digitales con intención, rendimiento y movimiento.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
