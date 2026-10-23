"use client";
import { Children, useEffect, useState, type ReactNode } from "react";

export default function Carousel({ children, label, featured = false }: { children: ReactNode; label: string; featured?: boolean }) {
  const slides = Children.toArray(children);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPlaying(!media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!playing || hovered || focused || slides.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && !document.querySelector("dialog[open]")) setActive((i) => (i + 1) % slides.length);
    }, featured ? 3200 : 2500);
    return () => window.clearInterval(timer);
  }, [playing, hovered, focused, slides.length, featured]);
  const show = (i: number) => setActive((i + slides.length) % slides.length);
  const dots = <div className={featured ? "featured-dots" : "hero-dots"} aria-label="Cambiar portada" role="group">{slides.map((_, i) => <button type="button" key={i} className={(featured ? "" : "hero-dot ") + (i === active ? "is-active" : "")} aria-label={label + ": ver " + (i + 1)} aria-current={active === i ? "true" : undefined} onClick={() => show(i)} />)}</div>;
  return <div className={featured ? "shop-featured" : "hero-carousel"} role="region" aria-roledescription="carrusel" aria-label={label}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
    <div className={featured ? "shop-featured-slides" : "hero-slides"} aria-live={playing && !hovered && !focused ? "off" : "polite"}>
      {slides.map((slide, i) => <div key={i} className={(featured ? "featured-slide-wrapper" : "hero-slide") + (i === active ? " is-active" : "")} hidden={i !== active} role="group" aria-label={(i + 1) + " de " + slides.length}>{slide}</div>)}
    </div>
    {featured ? <div className="featured-controls"><button type="button" aria-label={label + ": anterior"} onClick={() => show(active - 1)}>‹</button>{dots}<button type="button" aria-label={label + ": siguiente"} onClick={() => show(active + 1)}>›</button></div> : <><button type="button" className="hero-arrow hero-prev" aria-label="Portada anterior" onClick={() => show(active - 1)}>‹</button><button type="button" className="hero-arrow hero-next" aria-label="Portada siguiente" onClick={() => show(active + 1)}>›</button>{dots}</>}
    <button type="button" className="focus-only" aria-label={(playing ? "Pausar" : "Activar") + " rotación de " + label} aria-pressed={!playing} onClick={() => setPlaying(!playing)}>{playing ? "Pausar" : "Activar"} rotación</button>
  </div>;
}
