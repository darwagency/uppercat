"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export default function Rail({ children, label, className = "", auto = false, reverse = false }: { children: ReactNode; label: string; className?: string; auto?: boolean; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; left: number; moved: boolean } | null>(null);
  const preventClick = useRef(false);
  const interaction = useRef(false);
  const id = useId();
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el || !auto || paused) return;
    let frame = 0, previous = 0, direction = reverse ? -1 : 1;
    if (reverse && el.scrollLeft === 0) el.scrollLeft = el.scrollWidth - el.clientWidth;
    const tick = (now: number) => {
      const dt = previous ? Math.min(now - previous, 40) : 0;
      previous = now;
      if (!media.matches && !document.hidden && !interaction.current && !el.contains(document.activeElement) && !document.querySelector("dialog[open]") && !drag.current) {
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) direction = -1;
        if (el.scrollLeft <= 0) direction = 1;
        el.scrollLeft += direction * dt * 0.035;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [auto, paused, reverse]);
  const shift = (direction: number) => {
    const el = ref.current;
    if (!el) return;
    const distance = el.firstElementChild?.getBoundingClientRect().width || el.clientWidth * .8;
    const end = el.scrollWidth - el.clientWidth;
    const next = direction > 0 && el.scrollLeft >= end - 2 ? 0 : direction < 0 && el.scrollLeft <= 2 ? end : el.scrollLeft + direction * (distance + 16);
    el.scrollTo({ left: next, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const endDrag = () => { preventClick.current = Boolean(drag.current?.moved); drag.current = null; };
  return <div className={`rail-shell ${className}`}>
    <div className="rail-toolbar"><span>{label}</span><div className="rail-controls">
      {auto && <button type="button" aria-label={`${paused ? "Activar" : "Pausar"} movimiento de ${label}`} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "▷" : "Ⅱ"}</button>}
      <button type="button" aria-label={`${label}: anteriores`} aria-controls={id} onClick={() => shift(-1)}>←</button>
      <button type="button" aria-label={`${label}: siguientes`} aria-controls={id} onClick={() => shift(1)}>→</button>
    </div></div>
    <div className="rail" id={id} ref={ref} role="region" aria-label={label} tabIndex={0}
      onMouseEnter={() => { interaction.current = true; }} onMouseLeave={() => { interaction.current = false; endDrag(); }}
      onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === "ArrowLeft" || e.key === "ArrowRight")) { e.preventDefault(); shift(e.key === "ArrowRight" ? 1 : -1); } }}
      onDragStart={(e) => e.preventDefault()}
      onPointerDown={(e) => { preventClick.current = false; if (e.pointerType !== "mouse" || e.button !== 0) return; drag.current = { id: e.pointerId, x: e.clientX, left: e.currentTarget.scrollLeft, moved: false }; }}
      onPointerMove={(e) => { const d = drag.current; if (!d || d.id !== e.pointerId) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 7) { d.moved = true; e.currentTarget.setPointerCapture(e.pointerId); } if (d.moved) { e.currentTarget.scrollLeft = d.left - dx; e.preventDefault(); } }}
      onPointerUp={endDrag} onPointerCancel={endDrag}
      onClickCapture={(e) => { if (preventClick.current) { e.preventDefault(); e.stopPropagation(); preventClick.current = false; } }}>
      {children}
    </div>
  </div>;
}
