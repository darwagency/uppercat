"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FluidCursor from "./FluidCursor";

const email = "hola@alexrivera.studio";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    setDark(saved === "dark");
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    window.localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
  }, [dark, themeReady]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <>
      <a className="skip-link" href="#contenido">Ir al contenido</a>
      <FluidCursor />
      <header className="site-header">
        <Link className="brand text-link" href="/" aria-label="Uppercat, ir al inicio">Uppercat<span className="brand-star">✳</span></Link>
        {pathname !== "/" && <Link className="back-link text-link" href="/#proyectos"><span aria-hidden="true">←</span> Índice</Link>}
        <nav className="top-nav" aria-label="Navegación principal">
          <Link className={`text-link ${pathname === "/info" ? "is-current" : ""}`} href="/info">Info</Link>
          <button type="button" className="text-link contact-trigger" onClick={copyEmail}>{copied ? "Email copiado" : "Contacto"}</button>
          <button type="button" className="theme-button" onClick={() => setDark((value) => !value)} aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"} title={dark ? "Modo claro" : "Modo oscuro"}>
            {dark ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.4" fill="currentColor"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M19.8 4.2l-2.1 2.1M6.3 17.7l-2.1 2.1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.8A8.8 8.8 0 0 1 8.2 3.5 8.8 8.8 0 1 0 20.5 15.8Z" fill="currentColor"/></svg>}
          </button>
        </nav>
      </header>
      {children}
      {!pathname.startsWith("/work/") && <footer className="site-footer">
        <div className="footer-contact"><span className="muted-label">Contacto</span><button type="button" onClick={copyEmail} className="text-link">{copied ? "Copiado al portapapeles ✓" : email}</button></div>
        <div className="footer-availability"><span className="muted-label">Disponible</span><span>Para nuevos proyectos</span></div>
        <div className="footer-year">© {new Date().getFullYear()}</div>
      </footer>}
    </>
  );
}
