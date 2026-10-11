"use client";

import { useEffect } from "react";
import { projects } from "@/data/projects";

// A deterministic displacement field: narrow at the viewport's middle,
// flared at both ends. Green stays neutral, so only X is warped by the SVG.
function createHourglassMap() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const image = context.createImageData(canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y++) {
    const edge = Math.pow(Math.abs(y / (canvas.height - 1) * 2 - 1), 1.8);
    const curvature = -0.75 + edge * 1.75;
    for (let x = 0; x < canvas.width; x++) {
      const horizontal = x / (canvas.width - 1) * 1.8 - 0.9;
      const offset = (y * canvas.width + x) * 4;
      image.data[offset] = Math.round((0.5 - horizontal * curvature * 0.55) * 255);
      image.data[offset + 1] = 128;
      image.data[offset + 2] = 128;
      image.data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

export default function GalleryScrollMotion({ copies }: { copies: number }) {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLElement>(".project-image-link[data-motion-index]"));
    const layers = links.map((link) => ({
      link,
      card: link.closest<HTMLElement>(".project-card")!,
      map: document.getElementById(`gallery-hourglass-map-${link.dataset.motionIndex}`)!,
      displacement: document.getElementById(`gallery-hourglass-displacement-${link.dataset.motionIndex}`)!,
      active: false,
    }));
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const mobile = window.matchMedia("(max-width: 900px)");
    const href = createHourglassMap();
    if (!layers.length || !href) return;
    layers.forEach(({ map }) => map.setAttribute("href", href));

    let previousScroll = window.scrollY;
    let previousTime = performance.now();
    let targetSpeed = 0;
    let speed = 0;
    let frame = 0;
    let previousFrame = 0;
    let nextFrame = 0;

    const resetLayer = (layer: typeof layers[number]) => {
      if (!layer.active) return;
      const { link, displacement } = layer;
      layer.active = false;
      link.style.transform = "";
      link.style.filter = "";
      link.style.willChange = "";
      displacement.setAttribute("scale", "0");
    };
    const reset = () => layers.forEach(resetLayer);
    const applyMotion = (intensity: number) => {
      // Read all layout first; then apply styles only to nearby images.
      const height = window.innerHeight;
      const geometry = layers.map((layer) => ({ layer, rect: layer.card.getBoundingClientRect(), imageHeight: layer.link.offsetHeight }));
      geometry.forEach(({ layer, rect, imageHeight }) => {
        if (rect.bottom < -imageHeight * 0.4 || rect.top > height + imageHeight * 0.4 || !imageHeight) {
          resetLayer(layer);
          return;
        }
        const center = (rect.top + imageHeight / 2) / height;
        const edge = Math.min(1, Math.abs(center * 2 - 1));
        const strength = intensity * (mobile.matches ? 0.65 : 1);
        layer.map.setAttribute("y", (-rect.top / imageHeight).toFixed(5));
        layer.map.setAttribute("height", (height / imageHeight).toFixed(5));
        layer.displacement.setAttribute("scale", (strength * 0.65).toFixed(4));
        if (!layer.active) {
          layer.active = true;
          layer.link.style.willChange = "transform, filter";
          layer.link.style.filter = `url(#gallery-hourglass-${layer.link.dataset.motionIndex})`;
        }
        layer.link.style.transform = `translate3d(0, ${(Math.sign(speed) * strength * edge * 7).toFixed(2)}px, 0) scaleY(${(1 + strength * edge * 0.16).toFixed(4)})`;
      });
    };
    const tick = (now: number) => {
      frame = 0;
      if (!motion.matches || document.hidden) { reset(); return; }
      if (now < nextFrame) { frame = requestAnimationFrame(tick); return; }
      nextFrame = Math.max(nextFrame + 1000 / 60, now);
      const dt = Math.min(previousFrame ? (now - previousFrame) / 1000 : 1 / 60, 0.05);
      previousFrame = now;
      targetSpeed *= Math.exp(-dt * 7);
      speed += (targetSpeed - speed) * (1 - Math.exp(-dt * 15));
      const intensity = Math.min(Math.abs(speed) / 1500, 1);
      if (intensity < 0.006 && Math.abs(targetSpeed) < 8) {
        reset();
        previousFrame = 0;
        nextFrame = 0;
        return;
      }
      applyMotion(intensity);
      frame = requestAnimationFrame(tick);
    };
    const start = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const onScroll = () => {
      const now = performance.now();
      const current = window.scrollY;
      const distance = current - previousScroll;
      const elapsed = Math.max(8, Math.min(now - previousTime, 100));
      previousScroll = current;
      previousTime = now;
      if (!motion.matches || Math.abs(distance) < 0.1) return;
      targetSpeed = Math.max(-3500, Math.min(3500, distance / elapsed * 1000));
      start();
    };
    const onRecenter = (event: Event) => {
      previousScroll += (event as CustomEvent<{ shift: number }>).detail.shift;
      if (motion.matches && Math.abs(speed) > 8) applyMotion(Math.min(Math.abs(speed) / 1500, 1));
    };
    const onMotionChange = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previousFrame = 0;
      nextFrame = 0;
      targetSpeed = 0;
      speed = 0;
      previousScroll = window.scrollY;
      previousTime = performance.now();
      reset();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("gallery:recenter", onRecenter);
    document.addEventListener("visibilitychange", onMotionChange);
    motion.addEventListener("change", onMotionChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("gallery:recenter", onRecenter);
      document.removeEventListener("visibilitychange", onMotionChange);
      motion.removeEventListener("change", onMotionChange);
      if (frame) cancelAnimationFrame(frame);
      reset();
    };
  }, [copies]);

  return (
    <svg className="gallery-liquid-defs" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {Array.from({ length: copies * projects.length }, (_, index) => (
          <filter key={index} id={`gallery-hourglass-${index}`} x="-40%" y="-20%" width="180%" height="140%" primitiveUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
            <feImage id={`gallery-hourglass-map-${index}`} x="-0.4" y="0" width="1.8" height="1" preserveAspectRatio="none" result="hourglass" />
            <feDisplacementMap id={`gallery-hourglass-displacement-${index}`} in="SourceGraphic" in2="hourglass" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
