const MAX_SPEED = 900; // CSS pixels per second, independent of wheel/event rate.
const MAX_ACCELERATION = 6500;
const FRAME_INTERVAL = 1000 / 60;

export type GalleryScrollController = {
  scrollTo: (top: number) => void;
  dispose: () => void;
};

export function createGalleryScrollController(): GalleryScrollController {
  const desktop = window.matchMedia("(min-width: 901px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let position = window.scrollY;
  let target = position;
  let velocity = 0;
  let frame = 0;
  let lastFrame = 0;
  let nextFrame = 0;
  let lastWritten = position;

  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
    nextFrame = 0;
    velocity = 0;
    position = window.scrollY;
    target = position;
    lastWritten = position;
  };

  const tick = (now: number) => {
    frame = 0;
    if (document.hidden) { stop(); return; }
    if (now < nextFrame) { frame = requestAnimationFrame(tick); return; }
    nextFrame = Math.max(nextFrame + FRAME_INTERVAL, now);
    // Clamp elapsed time so a busy/background frame cannot produce a big jump.
    const dt = Math.min(lastFrame ? (now - lastFrame) / 1000 : 1 / 60, 1 / 30);
    lastFrame = now;
    const remaining = target - position;
    if (Math.abs(remaining) < 0.5) { stop(); return; }

    let step: number;
    if (reducedMotion.matches) {
      // Limit user-initiated scrolling without adding an inertial ease-out.
      step = Math.sign(remaining) * Math.min(Math.abs(remaining), MAX_SPEED * dt);
    } else {
      const wanted = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, remaining * 10));
      const change = Math.max(-MAX_ACCELERATION * dt, Math.min(MAX_ACCELERATION * dt, wanted - velocity));
      velocity += change;
      step = velocity * dt;
      if (Math.sign(step) !== Math.sign(remaining)) step = 0;
      if (Math.abs(step) > Math.abs(remaining)) step = remaining;
    }
    position += step;
    window.scrollTo({ top: position, behavior: "instant" });
    lastWritten = window.scrollY;
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (!frame) {
      position = window.scrollY;
      lastWritten = position;
      lastFrame = 0;
      nextFrame = 0;
      frame = requestAnimationFrame(tick);
    }
  };

  const addInput = (delta: number, budget: number) => {
    if (!frame) target = window.scrollY;
    // Reversing direction cancels pending travel instead of fighting a queue.
    if (delta * (target - position) < 0) {
      target = window.scrollY;
      velocity = 0;
    }
    target = Math.max(window.scrollY - budget, Math.min(window.scrollY + budget, target + delta));
    start();
  };

  const onWheel = (event: WheelEvent) => {
    if (event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const element = event.target instanceof Element ? event.target : null;
    if (element?.closest("input, textarea, select, [contenteditable=true]")) return;
    if (!event.deltaY) return;
    event.preventDefault();
    const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1;
    // An aggressive burst must never leave seconds of queued movement.
    addInput(event.deltaY * unit, reducedMotion.matches ? 96 : Math.min(400, window.innerHeight * 0.45));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    const element = event.target instanceof Element ? event.target : null;
    if (element?.closest("input, textarea, select, [contenteditable=true]")) return;
    if (event.key === " " && element?.closest("button, a")) return;
    let delta = 0;
    if (event.key === "ArrowDown") delta = 48;
    else if (event.key === "ArrowUp") delta = -48;
    else if (event.key === "PageDown" || event.key === " ") delta = window.innerHeight * (event.shiftKey ? -0.8 : 0.8);
    else if (event.key === "PageUp") delta = -window.innerHeight * 0.8;
    else { stop(); return; }
    event.preventDefault();
    addInput(delta, window.innerHeight * 0.8);
  };

  const onRecenter = (event: Event) => {
    const shift = (event as CustomEvent<{ shift: number }>).detail.shift;
    position += shift;
    target += shift;
    lastWritten = window.scrollY;
  };
  const onScroll = () => {
    // Scrollbar dragging, browser history and native anchors remain in control.
    if (frame && Math.abs(window.scrollY - lastWritten) > 2) stop();
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("pointerdown", stop, { passive: true });
  window.addEventListener("resize", stop);
  window.addEventListener("gallery:recenter", onRecenter);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", stop);
  desktop.addEventListener("change", stop);
  reducedMotion.addEventListener("change", stop);

  return {
    scrollTo(top) {
      stop();
      if (!desktop.matches) {
        window.scrollTo({ top, behavior: reducedMotion.matches ? "instant" : "smooth" });
        return;
      }
      target = top;
      start();
    },
    dispose() {
      stop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("resize", stop);
      window.removeEventListener("gallery:recenter", onRecenter);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", stop);
      desktop.removeEventListener("change", stop);
      reducedMotion.removeEventListener("change", stop);
    },
  };
}
