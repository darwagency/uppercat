"use client";
import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import useAmbientMotion from "./useAmbientMotion";

export default function Carousel({ children, label, featured = false }: { children: ReactNode; label: string; featured?: boolean }) {
  const slides = Children.toArray(children);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const { running, pauseFor } = useAmbientMotion(container, playing);
  useEffect(() => {
    if (!running || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, featured ? 6500 : 6000);
    return () => window.clearInterval(timer);
  }, [running, slides.length, featured]);
  const show = (i: number) => { pauseFor(); setActive((i + slides.length) % slides.length); };
  const dots = <div className={featured ? "featured-dots" : "hero-dots"} aria-label="Cambiar portada" role="group">{slides.map((_, i) => <button type="button" key={i} className={(featured ? "" : "hero-dot ") + (i === active ? "is-active" : "")} aria-label={label + ": ver " + (i + 1)} aria-current={active === i ? "true" : undefined} onClick={() => show(i)} />)}</div>;
  return <div ref={container} className={featured ? "shop-featured" : "hero-carousel"} role="region" aria-roledescription="carrusel" aria-label={label}>
    <div className={featured ? "shop-featured-slides" : "hero-slides"} aria-live={running ? "off" : "polite"}>
      {slides.map((slide, i) => <div key={i} className={(featured ? "featured-slide-wrapper" : "hero-slide") + (i === active ? " is-active" : "")} aria-hidden={i !== active} inert={i !== active} role="group" aria-label={(i + 1) + " de " + slides.length}>{slide}</div>)}
    </div>
    {featured ? <div className="featured-controls"><button type="button" aria-label={label + ": anterior"} onClick={() => show(active - 1)}>‹</button>{dots}<button type="button" aria-label={label + ": siguiente"} onClick={() => show(active + 1)}>›</button></div> : <><button type="button" className="hero-arrow hero-prev" aria-label="Portada anterior" onClick={() => show(active - 1)}>‹</button><button type="button" className="hero-arrow hero-next" aria-label="Portada siguiente" onClick={() => show(active + 1)}>›</button>{dots}</>}
    <button type="button" className="focus-only" aria-label={(playing ? "Pausar" : "Activar") + " rotación de " + label} aria-pressed={!playing} onClick={() => setPlaying(!playing)}>{playing ? "Pausar" : "Activar"} rotación</button>
  </div>;
}
