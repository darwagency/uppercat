"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";

const SLIDE_COUNT = 4;
const LOOP_COPIES = 5;
const MIDDLE_COPY = Math.floor(LOOP_COPIES / 2);

export default function ProjectCarousel({ project }: { project: Project }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const viewport = viewportRef.current;
    const displacement = displacementRef.current;
    const progress = progressRef.current;
    if (!viewport || !displacement || !progress) return;

    const layers = Array.from(viewport.querySelectorAll<HTMLElement>(".case-slide-motion"));
    const slides = Array.from(viewport.querySelectorAll<HTMLElement>(".case-slide"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchLayout = window.matchMedia("(max-width: 900px)");
    let target = 0;
    let previous = 0;
    let intensity = 0;
    let direction = 1;
    let frame = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let slideWidth = 0;
    let cycleWidth = 1;
    let activeIndex = 0;

    const positionOf = (slide: HTMLElement) =>
      slide.getBoundingClientRect().left - viewport.getBoundingClientRect().left + viewport.scrollLeft;

    const measure = () => {
      slideWidth = slides[0]?.offsetWidth ?? 0;
      cycleWidth = Math.max(1, slides[SLIDE_COUNT] && slides[0] ? positionOf(slides[SLIDE_COUNT]) - positionOf(slides[0]) : 1);
    };

    const normalizePosition = (position: number) => {
      const middleStart = slides[MIDDLE_COPY * SLIDE_COUNT] ? positionOf(slides[MIDDLE_COPY * SLIDE_COUNT]) : 0;
      return middleStart + ((position - middleStart) % cycleWidth + cycleWidth) % cycleWidth;
    };

    const recenter = (position: number) => {
      const normalized = normalizePosition(position);
      const shift = normalized - position;
      if (shift) {
        viewport.scrollLeft += shift;
        target += shift;
        previous += shift;
        dragStartScroll += shift;
      }
      return normalized;
    };

    const updatePosition = () => {
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      slides.forEach((slide, index) => {
        const distance = Math.abs(positionOf(slide) + slide.offsetWidth / 2 - center);
        if (distance < nearestDistance) {
          nearestIndex = index;
          nearestDistance = distance;
        }
      });
      activeIndex = nearestIndex % SLIDE_COUNT;
      setActive((current) => current === activeIndex ? current : activeIndex);
      const middleStart = slides[MIDDLE_COPY * SLIDE_COUNT] ? positionOf(slides[MIDDLE_COPY * SLIDE_COUNT]) : 0;
      const withinCycle = ((viewport.scrollLeft - middleStart) % cycleWidth + cycleWidth) % cycleWidth;
      progress.style.transform = `scaleX(${withinCycle / cycleWidth})`;
    };

    const resetMotion = () => {
      displacement.setAttribute("scale", "0");
      layers.forEach((layer) => {
        layer.style.transform = "";
        layer.style.filter = "";
        layer.style.willChange = "";
      });
    };

    const tick = () => {
      const current = viewport.scrollLeft;
      let next = reducedMotion.matches
        ? target
        : Math.abs(target - current) < 0.35 ? target : current + (target - current) * 0.13;
      if (next !== current) viewport.scrollLeft = next;
      next = recenter(viewport.scrollLeft);

      const travel = next - previous;
      previous = next;
      if (Math.abs(travel) > 0.05) direction = Math.sign(travel);
      const wanted = reducedMotion.matches ? 0 : Math.min(Math.abs(travel) / 21, 1);
      intensity += (wanted - intensity) * 0.24;

      if (intensity > 0.012) {
        const stretch = 1 + intensity * (touchLayout.matches ? 0.035 : 0.065);
        const shear = direction * intensity * 1.25;
        displacement.setAttribute("scale", (touchLayout.matches ? 0 : intensity * 34).toFixed(1));
        layers.forEach((layer) => {
          layer.style.willChange = "transform, filter";
          layer.style.transform = `scaleX(${stretch.toFixed(3)}) skewX(${shear.toFixed(2)}deg)`;
          layer.style.filter = touchLayout.matches ? "" : "url(#case-liquid-filter)";
        });
      } else {
        resetMotion();
      }

      updatePosition();
      if (Math.abs(target - next) > 0.35 || intensity > 0.012) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      if (touchLayout.matches || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      target += movement * 1.1;
      recenter(target);
      start();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      dragStartX = event.clientX;
      dragStartScroll = target;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      target = dragStartScroll - (event.clientX - dragStartX) * 1.35;
      recenter(target);
      start();
    };

    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      viewport.classList.remove("is-dragging");
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const gap = parseFloat(getComputedStyle(viewport.querySelector<HTMLElement>(".case-gallery-set") ?? viewport).columnGap) || 0;
      const amount = slideWidth + gap;
      const middleFirst = slides[MIDDLE_COPY * SLIDE_COUNT];
      const middleLast = slides[MIDDLE_COPY * SLIDE_COUNT + SLIDE_COUNT - 1];
      if (event.key === "ArrowRight") target += amount;
      else if (event.key === "ArrowLeft") target -= amount;
      else if (event.key === "Home" && middleFirst) target = positionOf(middleFirst) + middleFirst.offsetWidth / 2 - viewport.clientWidth / 2;
      else if (event.key === "End" && middleLast) target = positionOf(middleLast) + middleLast.offsetWidth / 2 - viewport.clientWidth / 2;
      else return;
      event.preventDefault();
      recenter(target);
      start();
    };

    const onScroll = () => {
      if (touchLayout.matches) {
        target = viewport.scrollLeft;
        recenter(target);
        updatePosition();
        start();
      }
    };

    const onResize = () => {
      measure();
      const slide = slides[MIDDLE_COPY * SLIDE_COUNT + activeIndex];
      if (slide) viewport.scrollLeft = positionOf(slide) + slide.offsetWidth / 2 - viewport.clientWidth / 2;
      target = recenter(viewport.scrollLeft);
      previous = target;
      updatePosition();
    };

    const onMotionChange = () => {
      if (reducedMotion.matches) resetMotion();
      start();
    };

    measure();
    const middleFirst = slides[MIDDLE_COPY * SLIDE_COUNT];
    viewport.scrollLeft = (middleFirst ? positionOf(middleFirst) : 0) + (touchLayout.matches ? 0 : window.innerWidth * 0.045);
    target = viewport.scrollLeft;
    previous = target;
    updatePosition();
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);
    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerUp);
    viewport.addEventListener("keydown", onKeyDown);
    viewport.addEventListener("scroll", onScroll, { passive: true });
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("pointercancel", onPointerUp);
      viewport.removeEventListener("keydown", onKeyDown);
      viewport.removeEventListener("scroll", onScroll);
      reducedMotion.removeEventListener("change", onMotionChange);
      cancelAnimationFrame(frame);
      resetMotion();
    };
  }, [project.slug]);

  return (
    <div className="case-gallery-wrap">
      <svg className="case-liquid-defs" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="case-liquid-filter" x="-8%" y="-10%" width="116%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.003" numOctaves="1" seed="8" result="ripples" />
            <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="ripples" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div ref={viewportRef} className="case-gallery-viewport" role="region" aria-label={`Galería horizontal de ${project.title}`} tabIndex={0}>
        <div className="case-gallery-track">
          {Array.from({ length: LOOP_COPIES }, (_, copyIndex) => (
            <div className="case-gallery-set" key={copyIndex} aria-hidden={copyIndex !== MIDDLE_COPY}>
              <figure className="case-slide case-slide-cover">
                <div className="case-slide-motion">
                  <Image src={project.colorImage} alt={project.alt} fill priority={copyIndex === MIDDLE_COPY} sizes="(max-width: 900px) 88vw, 42vw" draggable={false} />
                  <div className="case-cover-shade" />
                  <div className="case-cover-top"><span>{project.category}</span><span>{project.year}</span></div>
                  <figcaption className="case-cover-title"><span>{project.eyebrow}</span><strong>{project.title}</strong></figcaption>
                </div>
              </figure>
              <figure className="case-slide case-slide-editorial" style={{ backgroundColor: project.color }}>
                <div className="case-slide-motion">
                  <div className="case-art-board">
                    <div className="case-art-head"><strong>{project.title}<span>✳</span></strong><span>PORTAFOLIO / {project.year}</span></div>
                    <div className="case-art-grid">
                      <div className="case-art-copy"><span className="case-art-symbol">✳</span><h2>{project.statement}</h2><p>{project.category} — una experiencia digital para mirar más de cerca.</p><span className="case-art-line" /></div>
                      <div className="case-art-photo"><Image src={project.detailImage} alt={`Detalle visual de ${project.title}`} fill sizes="(max-width: 900px) 46vw, 25vw" draggable={false} /></div>
                    </div>
                    <figcaption className="case-art-foot"><span>DISEÑO EN MOVIMIENTO</span><span>01 — 04</span></figcaption>
                  </div>
                </div>
              </figure>
              <figure className="case-slide case-slide-detail">
                <div className="case-slide-motion">
                  <Image src={project.detailImage} alt={`Acercamiento al proyecto ${project.title}`} fill sizes="(max-width: 900px) 88vw, 42vw" draggable={false} />
                  <figcaption><span>EL PROCESO</span><strong>{project.statement}</strong></figcaption>
                </div>
              </figure>
              <figure className="case-slide case-slide-composition" style={{ backgroundColor: project.color }}>
                <div className="case-slide-motion">
                  <div className="case-composition-image"><Image src={project.colorImage} alt="" fill sizes="(max-width: 900px) 45vw, 23vw" draggable={false} /></div>
                  <figcaption className="case-composition-copy"><span>UNA MIRADA MÁS CERCANA</span><strong>{project.title}</strong><p>{project.services.join(" · ")}</p><span className="case-composition-star">✳</span></figcaption>
                </div>
              </figure>
            </div>
          ))}
        </div>
      </div>
      <div className="case-gallery-hint" aria-hidden="true"><span>{String(active + 1).padStart(2, "0")} / {String(SLIDE_COUNT).padStart(2, "0")}</span><span className="case-gallery-progress"><span ref={progressRef} /></span><span>DESLIZA PARA EXPLORAR <b>→</b></span></div>
    </div>
  );
}
