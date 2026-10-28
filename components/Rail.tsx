"use client";
import { Children, cloneElement, isValidElement, useEffect, useId, useRef, useState, type ReactNode, type ReactElement, type CSSProperties } from "react";
import useAmbientMotion from "./useAmbientMotion";

type Variant = "skills" | "packaging" | "illustrations" | "social-top" | "social-bottom" | "brands" | "testimonials" | "products";
const classes: Record<Variant, string> = { skills:"skills-loop", packaging:"packaging-scroller", illustrations:"illustration-loop", "social-top":"social-loop social-row-top", "social-bottom":"social-loop social-row-bottom", brands:"brands-loop", testimonials:"testimonials-loop", products:"shop-products-grid" };
// Signed pixels/second: negative moves the artwork right; positive moves it left.
const speeds: Record<Variant, number> = { skills:0, packaging:-16, illustrations:16, "social-top":-18, "social-bottom":18, brands:-18, testimonials:12, products:12 };

export default function Rail({ children, label, variant, showPauseControl = true, smooth = false, speed }: { children: ReactNode; label: string; variant: Variant; showPauseControl?: boolean; smooth?: boolean; speed?: number }) {
  const viewport = useRef<HTMLDivElement>(null);
  const original = useRef<HTMLDivElement>(null);
  const unit = useRef(0);
  const drag = useRef<{ id: number; x: number; left: number; moved: boolean } | null>(null);
  const preventClick = useRef(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState<string>();
  const velocity = useRef(0);
  const remainder = useRef(0);
  const motionSpeed = speed ?? speeds[variant];
  const { running, pauseFor } = useAmbientMotion(viewport, ready && !paused && motionSpeed !== 0);
  const id = useId();
  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    const el = viewport.current, group = original.current;
    if (!el || !group || !ready) return;
    const measure = () => {
      el.querySelectorAll<HTMLElement>('[data-rail-copy] a, [data-rail-copy] button, [data-rail-copy] [tabindex]').forEach(node => { node.tabIndex = -1; });
      const phase = unit.current ? (el.scrollLeft - unit.current) / unit.current : 0;
      if (variant === "skills") setCardWidth(Math.max(185, innerWidth > 760 ? (el.clientWidth - 20) / 3 : el.clientWidth * .76).toFixed(1) + "px");
      else setCardWidth(undefined);
      unit.current = group.getBoundingClientRect().width;
      el.scrollLeft = unit.current * (1 + Math.max(-.9, Math.min(.9, phase)));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el); observer.observe(group); measure();
    return () => observer.disconnect();
  }, [ready, variant]);
  useEffect(() => {
    const el = viewport.current;
    if (!el || !ready || (!smooth && !running)) return;
    const track = el.querySelector<HTMLElement>(".loop-track");
    if (smooth && (!running && (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches))) {
      velocity.current = 0;
      remainder.current = 0;
      if (track) track.style.transform = "";
      return;
    }
    let frame = 0, previous = 0;
    // Keep fractional distance: repeatedly adding <1px to scrollLeft can round to zero.
    let position = el.scrollLeft - (smooth ? remainder.current : 0), lastWritten = el.scrollLeft;
    const tick = (now: number) => {
      const dt = previous ? Math.min(now - previous, 48) : 0; previous = now;
      if (el.scrollLeft !== lastWritten) position += el.scrollLeft - lastWritten;
      if (smooth) {
        const target = running ? motionSpeed : 0;
        velocity.current += (target - velocity.current) * (1 - Math.exp(-dt / 380));
        if (Math.abs(velocity.current) < .02 && !running) velocity.current = 0;
      }
      position += (smooth ? velocity.current : motionSpeed) * dt / 1000;
      el.scrollLeft = position;
      // Native scroll positions can round to whole pixels. Preserve the subpixel
      // remainder on the compositor so a slow rail doesn't step frame by frame.
      if (smooth && track) {
        remainder.current = el.scrollLeft - position;
        track.style.transform = `translate3d(${remainder.current}px,0,0)`;
      }
      lastWritten = el.scrollLeft;
      if (running || (smooth && velocity.current !== 0)) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [running, motionSpeed, ready, smooth]);
  useEffect(() => {
    const release = () => {
      if (!drag.current) return;
      preventClick.current = drag.current.moved;
      drag.current = null;
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => { window.removeEventListener("pointerup", release); window.removeEventListener("pointercancel", release); };
  }, []);
  const shift = (direction: number) => {
    const el = viewport.current, group = original.current;
    if (!el || !group) return;
    pauseFor();
    const width = group.firstElementChild?.getBoundingClientRect().width || el.clientWidth * .8;
    const gap = parseFloat(getComputedStyle(group).gap) || 0;
    el.scrollBy({ left: direction * (width + gap), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const copy = Children.map(children, (child) => isValidElement(child) && typeof child.type === "string" ? cloneElement(child as ReactElement<{tabIndex?: number}>, { tabIndex: -1 }) : child);
  const groupClass = variant === "products" ? "shop-loop-group loop-group" : "loop-group";
  const controls = (direction: number) => <button type="button" className={variant === "skills" ? "skills-arrow skills-" + (direction < 0 ? "prev" : "next") : variant === "products" ? "shop-list-arrow" : "round-btn"} aria-label={label + ": " + (direction < 0 ? "anteriores" : "siguientes")} aria-controls={id} onClick={() => shift(direction)}>{variant === "packaging" ? (direction < 0 ? "←" : "→") : (direction < 0 ? "‹" : "›")}</button>;
  const finish = () => { if (drag.current) { preventClick.current = drag.current.moved; drag.current = null; } };
  return <>
    {variant === "packaging" && <div className="gallery-toolbar content-wrap"><span className="eyebrow">TRABAJOS SELECCIONADOS / 01</span><div className="gallery-controls">{controls(-1)}{controls(1)}</div></div>}
    <div className={variant === "skills" ? "skills-carousel-shell" : variant === "products" ? "shop-list-shell" : undefined}>
      {(variant === "skills" || variant === "products") && controls(-1)}
      <div className={"loop-viewport " + classes[variant]} ref={viewport} id={id} role="region" aria-label={label} tabIndex={0} style={{ "--card-width":cardWidth } as CSSProperties}
        onScroll={(e) => {
          const el = e.currentTarget, size = unit.current;
          if (!size) return;
          let offset = 0;
          if (el.scrollLeft < size * .5) offset = size;
          else if (el.scrollLeft > size * 1.5) offset = -size;
          if (offset) {
            // Do not move a keyboard-focused card into an inaccessible copy.
            if (document.activeElement !== el && el.contains(document.activeElement)) return;
            el.scrollLeft += offset;
            if (drag.current) drag.current.left += offset;
          }
        }}
        onKeyDown={(e) => { if (e.target === e.currentTarget && ["ArrowLeft","ArrowRight"].includes(e.key)) { e.preventDefault(); shift(e.key === "ArrowRight" ? 1 : -1); } }}
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={(e) => { preventClick.current = false; velocity.current = 0; pauseFor(); if (e.pointerType !== "mouse" || e.button !== 0) return; drag.current = {id:e.pointerId,x:e.clientX,left:e.currentTarget.scrollLeft,moved:false}; }}
        onPointerMove={(e) => { const d = drag.current; if (!d || d.id !== e.pointerId) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 7) { d.moved = true; e.currentTarget.setPointerCapture(e.pointerId); } if (d.moved) { e.currentTarget.scrollLeft = d.left - dx; e.preventDefault(); } }}
        onPointerUp={finish} onPointerCancel={finish} onClickCapture={(e) => { if (preventClick.current) { e.preventDefault(); e.stopPropagation(); preventClick.current = false; } }}>
        <div className={variant === "products" ? "shop-loop-track loop-track" : "loop-track"}>
          {ready && <div className={groupClass} aria-hidden="true" data-rail-copy="before" onMouseDown={(e) => e.preventDefault()}>{copy}</div>}
          <div className={groupClass} ref={original}>{children}</div>
          {ready && <div className={groupClass} aria-hidden="true" data-rail-copy="after" onMouseDown={(e) => e.preventDefault()}>{copy}</div>}
        </div>
      </div>
      {(variant === "skills" || variant === "products") && controls(1)}
    </div>
    {showPauseControl && motionSpeed !== 0 && <button type="button" className="focus-only" aria-label={(paused ? "Activar" : "Pausar") + " movimiento de " + label} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Activar" : "Pausar"} movimiento</button>}
  </>;
}
