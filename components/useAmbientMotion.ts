"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

// Keep ambient motion idle until it is visible and the visitor is not interacting.
export default function useAmbientMotion(target: RefObject<HTMLElement | null>, enabled = true) {
  const [running, setRunning] = useState(false);
  const resumeAt = useRef(0);
  const refresh = useRef<() => void>(() => {});
  const pauseFor = useCallback((milliseconds = 2400) => {
    resumeAt.current = performance.now() + milliseconds;
    refresh.current();
  }, []);

  useEffect(() => {
    const el = target.current;
    if (!el || !enabled) {
      setRunning(false);
      return;
    }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let hovered = matchMedia("(hover: hover)").matches && el.matches(":hover");
    let focused = el.contains(document.activeElement);
    let pressed = false;
    let timer = 0;
    const update = () => {
      window.clearTimeout(timer);
      const available = visible && !reduced.matches && !document.hidden && !hovered && !focused && !pressed && !document.querySelector("dialog[open]");
      const delay = Math.max(0, resumeAt.current - performance.now());
      setRunning(Boolean(available && delay === 0));
      if (available && delay > 0) timer = window.setTimeout(update, delay);
    };
    refresh.current = update;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    const enter = (e: PointerEvent) => { if (e.pointerType === "mouse") { hovered = true; update(); } };
    const leave = (e: PointerEvent) => { if (e.pointerType === "mouse") { hovered = false; update(); } };
    const focus = () => { focused = true; update(); };
    const blur = (e: FocusEvent) => {
      focused = e.relatedTarget instanceof Node && el.contains(e.relatedTarget);
      if (!focused) resumeAt.current = performance.now() + 1200;
      update();
    };
    const down = () => { pressed = true; update(); };
    const up = () => {
      if (!pressed) return;
      pressed = false;
      resumeAt.current = performance.now() + 2400;
      update();
    };
    const wheel = () => pauseFor();
    const dialog = (e: Event) => { if (e.target instanceof HTMLDialogElement) update(); };

    observer.observe(el);
    reduced.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    document.addEventListener("toggle", dialog, true);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusin", focus);
    el.addEventListener("focusout", blur);
    el.addEventListener("pointerdown", down, { passive: true });
    el.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", up, { passive: true });
    return () => {
      refresh.current = () => {};
      window.clearTimeout(timer);
      observer.disconnect();
      reduced.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      document.removeEventListener("toggle", dialog, true);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusin", focus);
      el.removeEventListener("focusout", blur);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [target, enabled, pauseFor]);

  return { running, pauseFor };
}
