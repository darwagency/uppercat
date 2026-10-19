"use client";
import Link from "next/link";
import Media from "./Media";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { contactUrl, sections, site } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const shop = pathname.startsWith("/tienda");
  const [open, setOpen] = useState(false);
  useEffect(() => { const close = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, []);
  return <header className="site-header" id="inicio"><nav className="nav-pill" aria-label="Navegación principal">
    <Link href="/" className="brand" aria-label="Uppercat, inicio" onClick={() => setOpen(false)}>UPPER<span>CAT✳</span></Link>
    <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="nav-links" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(!open)}>{open ? "×" : "☰"}</button>
    <div className={`nav-links ${open ? "is-open" : ""}`} id="nav-links">
      {[ ["/", "Home"], ["/#habilidades", "Servicios"], ["/#packaging", "Folio"], ["/tienda", "Tienda"], ["#contacto", "Contacto"] ].map(([href, label]) => <Link key={label} href={href} aria-current={label === "Tienda" && shop ? "page" : label === "Home" && !shop ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
    </div><a className="nav-cta" href={shop ? "#productos" : contactUrl} target={shop ? undefined : "_blank"} rel={shop ? undefined : "noopener noreferrer"}>{shop ? "VER PRODUCTOS" : "HABLEMOS"} ↗</a>
  </nav></header>;
}

export function SideIndex() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  useEffect(() => {
    let queued = false;
    const update = () => { let current = "inicio"; sections.forEach(([id]) => { if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) < innerHeight * .5) current = id; }); setActive(current); queued = false; };
    const scroll = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    update(); window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", scroll); document.addEventListener("keydown", escape);
    return () => { window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); document.removeEventListener("keydown", escape); };
  }, []);
  return <nav className={`side-index ${open ? "is-open" : ""}`} aria-label="Índice de secciones"><button type="button" aria-expanded={open} aria-controls="section-index" onClick={() => setOpen(!open)}>ÍNDICE {open ? "×" : "+"}</button><div id="section-index"><span className="eyebrow">EXPLORA / 09</span>{sections.map(([id, label]) => <a href={`#${id}`} key={id} aria-current={active === id ? "location" : undefined} onClick={() => setOpen(false)}>{label}</a>)}<Link href="/tienda">Tienda ↗</Link></div></nav>;
}

export function ContactFloat() { return <a className="whatsapp-float" href={contactUrl} target="_blank" rel="noopener noreferrer" aria-label="Contactar a Uppercat por WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3A13 13 0 0 0 4.7 22.3L3 29l6.9-1.8A13 13 0 1 0 16 3Zm0 23.6c-2 0-4-.5-5.7-1.6l-.5-.3-4.1 1.1 1.1-4-.3-.5a10.6 10.6 0 1 1 9.5 5.3Zm5.9-7.8c-.3-.2-1.9-.9-2.2-1s-.5-.1-.7.2c-.2.3-.8 1-1 1.2-.2.2-.3.2-.6.1a9.1 9.1 0 0 1-4.5-4c-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.6l-1-2.2c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.8 0 1.6 1.2 3.1 1.3 3.3.2.2 2.3 3.6 5.5 5 2.1.8 3 .9 4.1.7.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.6-.1-.2-.3-.3-.6-.5Z" /></svg></a>; }

export function Footer() { return <footer className="footer-shell" id="contacto"><div className="content-wrap"><div className="footer-invite"><span>¿TIENES UNA IDEA?</span><a href={contactUrl} target="_blank" rel="noopener noreferrer">HAGÁMOSLA<br />REALIDAD. <span>↗</span></a></div><div className="footer-grid"><Link href="/" className="footer-mark" aria-label="Uppercat, inicio"><span>UPPER<br />CAT✳</span><Media imageKey="footerMascot" alt="Firma gráfica de Uppercat" className="optional-art" contain /></Link><div className="footer-column"><span>NAVEGACIÓN</span><Link href="/">INICIO</Link><Link href="/#habilidades">SERVICIOS</Link><Link href="/#packaging">PORTAFOLIO</Link><Link href="/tienda">TIENDA</Link></div><div className="footer-column"><span>CONVERSEMOS</span><a href={`mailto:${site.email}`}>{site.email}</a><a href={contactUrl} target="_blank" rel="noopener noreferrer">{site.whatsappLabel}</a>{site.socials.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer">{item.label} ↗</a>)}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} UPPERCAT</span><span>DISEÑO CON CARÁCTER.</span><a href="#inicio">VOLVER ARRIBA ↑</a></div></div></footer>; }
