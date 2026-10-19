import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header, Footer, ContactFloat } from "@/components/SiteChrome";
import { site } from "@/data/site";
import "./globals.css";

const anton = localFont({ src: "../public/fonts/Anton-Regular.ttf", variable: "--font-anton", weight: "400", display: "swap" });
const dmSans = localFont({ src: "../public/fonts/DM-Sans.ttf", variable: "--font-dm-sans", weight: "100 1000", display: "swap" });

export const metadata: Metadata = { title: { default: "Uppercat | Diseño con carácter", template: "%s | Uppercat" }, description: site.description, applicationName: "Uppercat", openGraph: { title: "Uppercat | Diseño con carácter", description: site.description, locale: "es_CL", type: "website", siteName: "Uppercat" }, robots: { index: true, follow: true } };
export const viewport: Viewport = { themeColor: "#1f1f1f" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-CL" className={`${anton.variable} ${dmSans.variable}`}><body><a className="skip-link" href="#contenido">Saltar al contenido</a><Header />{children}<Footer /><ContactFloat /></body></html>;
}
