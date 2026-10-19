"use client";

import { Children, useEffect, useId, useState, type ReactNode } from "react";

export default function Carousel({ children, label, className = "" }: { children: ReactNode; label: string; className?: string }) {
  const slides = Children.toArray(children);
  const id = useId();
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
    }, 6000);
    return () => window.clearInterval(timer);
  }, [playing, hovered, focused, slides.length]);
  const show = (i: number) => setActive((i + slides.length) % slides.length);
  return <div className={`carousel ${className}`} role="region" aria-roledescription="carrusel" aria-label={label}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
    <div id={id} className="carousel-stage" aria-live={playing && !hovered && !focused ? "off" : "polite"}>
      {slides.map((slide, i) => <div key={i} className={`carousel-slide ${i === active ? "is-active" : ""}`} hidden={i !== active} role="group" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${slides.length}`}>{slide}</div>)}
    </div>
    <div className="carousel-controls">
      <button type="button" className="round-btn" aria-label={`${label}: anterior`} aria-controls={id} onClick={() => show(active - 1)}>←</button>
      <div className="carousel-dots">{slides.map((_, i) => <button type="button" key={i} aria-label={`${label}: ver ${i + 1}`} aria-current={active === i ? "true" : undefined} onClick={() => show(i)}><span /></button>)}</div>
      <button type="button" className="round-btn" aria-label={`${label}: siguiente`} aria-controls={id} onClick={() => show(active + 1)}>→</button>
      <button type="button" className="carousel-pause" aria-label={`${playing ? "Pausar" : "Activar"} rotación de ${label}`} aria-pressed={!playing} onClick={() => setPlaying(!playing)}>{playing ? "Ⅱ" : "▷"}</button>
    </div>
  </div>;
}
