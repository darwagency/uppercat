"use client";
import Link from "next/link";
import Media from "./Media";
import { useEffect, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { contactUrl, sections, site } from "@/data/site";

const fanStyle = (index: number): CSSProperties => {
  const distance = index - (sections.length - 1) / 2;
  return { "--fan-x": `${-(11 - Math.abs(distance) * 1.35)}px`, "--fan-y": `${distance * 1.6}px`, "--fan-angle": `${distance * .2}deg`, "--fan-delay": `${Math.abs(distance) * 12}ms` } as CSSProperties;
};

export function Header() {
  const shop = usePathname().startsWith("/tienda");
  const [open, setOpen] = useState(false);
  useEffect(() => { const close = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, []);
  const home = (hash: string) => shop ? "/" + hash : hash;
  return <header className="site-header" id="inicio"><nav className="nav-pill" aria-label="Navegación principal">
    <Link href={home("#inicio")} className="brand" aria-label="Uppercat, inicio" onClick={() => setOpen(false)}><span>UPPER<span className="brand-accent">/</span>CAT</span></Link>
    <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="nav-links" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(!open)}><span /><span /><span /></button>
    <div className={"nav-links" + (open ? " is-open" : "")} id="nav-links">
      {[[home("#inicio"),"Home"],[home("#habilidades"),"Servicios"],[home("#packaging"),"Folio"],["/tienda","Tienda"],["#contacto","Contacto"]].map(([href,label]) => <Link key={label} href={href} aria-current={shop && label === "Tienda" ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
    </div><a className={"nav-cta" + (shop ? " shop-nav-cta" : "")} href={shop ? "#productos" : "mailto:" + site.email + "?subject=Consulta%20de%20dise%C3%B1o"}>{shop ? "VER PRODUCTOS" : "HABLEMOS"} <span aria-hidden="true">↗</span></a>
  </nav></header>;
}

export function SideIndex() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const [light, setLight] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      let current = "inicio";
      sections.forEach(([id]) => { if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= innerHeight * .46) current = id; });
      setActive(current);
      const target = document.elementFromPoint(Math.max(0,innerWidth - 180),innerHeight * .5);
      setLight(Boolean(target?.closest(".skills-section,.brands-section,.shop-catalog")));
      frame = 0;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    update(); window.addEventListener("scroll",scroll,{passive:true}); window.addEventListener("resize",scroll); document.addEventListener("keydown",escape);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll",scroll); window.removeEventListener("resize",scroll); document.removeEventListener("keydown",escape); };
  }, []);
  return <nav className={"side-index" + (open ? " is-open" : "") + (light ? " light-index" : "")} aria-label="Índice de secciones"><button type="button" className="side-index-toggle" aria-expanded={open} aria-controls="side-index-list" onClick={() => setOpen(!open)}>ÍNDICE <span aria-hidden="true">☰</span></button><div className="side-index-items" id="side-index-list"><span className="side-index-title" style={fanStyle(-1)}>ÍNDICE (09)</span>{sections.map(([id,label],i) => <a href={"#" + id} key={id} style={fanStyle(i)} className={active === id ? "is-current" : undefined} aria-current={active === id ? "location" : undefined} onClick={() => setOpen(false)}>{label}</a>)}<Link className="side-index-shop" style={fanStyle(sections.length)} href="/tienda">Tienda ↗</Link></div></nav>;
}

export function ContactFloat() { return <a className="whatsapp-float" href={contactUrl} target="_blank" rel="noopener noreferrer" aria-label="Contactar a Uppercat por WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3A13 13 0 0 0 4.7 22.3L3 29l6.9-1.8A13 13 0 1 0 16 3Zm0 23.6c-2 0-4-.5-5.7-1.6l-.5-.3-4.1 1.1 1.1-4-.3-.5a10.6 10.6 0 1 1 9.5 5.3Zm5.9-7.8c-.3-.2-1.9-.9-2.2-1s-.5-.1-.7.2c-.2.3-.8 1-1 1.2-.2.2-.3.2-.6.1a9.1 9.1 0 0 1-4.5-4c-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.6l-1-2.2c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.8 0 1.6 1.2 3.1 1.3 3.3.2.2 2.3 3.6 5.5 5 2.1.8 3 .9 4.1.7.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.6-.1-.2-.3-.3-.6-.5Z" /></svg></a>; }

export function Footer() {
  const shop = usePathname().startsWith("/tienda");
  const home = (hash: string) => shop ? "/" + hash : hash;
  return <footer className="footer-shell" id="contacto"><div className="footer-grid content-wrap">
    <div className="footer-mark" aria-label="Uppercat"><span>UPPER<br />CAT</span><Media imageKey="footerMascot" alt="Firma gráfica de Uppercat" className="artwork-slot" contain /></div>
    <div className="footer-column"><span className="footer-title">NAVEGACIÓN</span><Link href={home("#inicio")}>INICIO</Link><Link href={home("#habilidades")}>SERVICIOS</Link><Link href={home("#packaging")}>PORTAFOLIO</Link><Link href="/tienda">TIENDA</Link>{!shop && <a href="#contacto">CONTACTO</a>}</div>
    <div className="footer-column"><span className="footer-title">¿HABLAMOS?</span><a href={"mailto:" + site.email}>ESCRÍBENOS</a><span className="sr-only">{site.whatsappLabel}</span><Link href={home("#menus")}>DISEÑO MENÚ</Link><Link href={home("#packaging")}>PACKAGING</Link><span className="sr-only">{site.email}</span></div>
    <div className="footer-column"><span className="footer-title">SÍGUENOS EN</span><div className="footer-social">{site.socials.length ? site.socials.map(item => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer">{item.label}</a>) : <><span aria-hidden="true">IG</span><span aria-hidden="true">Bē</span><span aria-hidden="true">TT</span><span className="sr-only">Perfiles por confirmar</span></>}</div><small>© {new Date().getFullYear()} UPPERCAT</small></div>
  </div></footer>;
}
