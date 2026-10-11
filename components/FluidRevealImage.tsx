"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const MAX_PARTICLES = 24;
const REVEAL_DURATION = 760;

type Particle = { x: number; y: number; radius: number; life: number };

type Props = {
  src: string;
  alt: string;
  priority: boolean;
  backgroundColor: string;
};

export default function FluidRevealImage({ src, alt, priority, backgroundColor }: Props) {
  const revealRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef(0);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const render = (now: number) => {
    const reveal = revealRef.current;
    if (!reveal) return;
    const elapsed = Math.min(now - lastFrameRef.current, 50);
    lastFrameRef.current = now;
    const particles = particlesRef.current;

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].life -= elapsed / REVEAL_DURATION;
      if (particles[i].life <= 0) particles.splice(i, 1);
    }

    if (particles.length) {
      const mask = particles.map(({ x, y, radius, life }) =>
        `radial-gradient(circle ${radius.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, rgba(0,0,0,${life.toFixed(3)}) 0%, rgba(0,0,0,${(life * 0.9).toFixed(3)}) 52%, transparent 100%)`
      ).join(", ");
      reveal.style.maskImage = mask;
      reveal.style.webkitMaskImage = mask;
      reveal.style.opacity = "1";
      frameRef.current = requestAnimationFrame(render);
    } else {
      reveal.style.opacity = "0";
      reveal.style.maskImage = "none";
      reveal.style.webkitMaskImage = "none";
      lastPointRef.current = null;
      frameRef.current = 0;
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const last = lastPointRef.current;
    const distance = last ? Math.hypot(x - last.x, y - last.y) : 0;
    const steps = Math.min(8, Math.max(1, Math.ceil(distance / 17)));
    const radius = 46 + Math.min(12, distance * 0.04);
    const particles = particlesRef.current;

    for (let step = 1; step <= steps; step++) {
      const fraction = step / steps;
      particles.push({
        x: last ? last.x + (x - last.x) * fraction : x,
        y: last ? last.y + (y - last.y) * fraction : y,
        radius: radius * (0.85 + 0.15 * Math.sin((particles.length + step) * 2.3)),
        life: 0.7 + fraction * 0.3,
      });
    }
    if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
    lastPointRef.current = { x, y };

    if (!frameRef.current) {
      lastFrameRef.current = performance.now();
      frameRef.current = requestAnimationFrame(render);
    }
  };

  return (
    <div className="project-image-wrap" style={{ backgroundColor }} onPointerMove={onPointerMove}>
      <div className="project-scroll-media">
        <Image className="project-base-image" src={src} alt={alt} fill priority={priority} sizes="(max-width: 900px) 100vw, 42vw" />
        <div ref={revealRef} className="project-color-reveal" aria-hidden="true">
          <Image src={src} alt="" fill sizes="(max-width: 900px) 100vw, 42vw" />
        </div>
      </div>
      <span className="project-hover-mark" aria-hidden="true">VER<br />PROYECTO <span>↗</span></span>
    </div>
  );
}
