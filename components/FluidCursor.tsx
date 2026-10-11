"use client";

import { useEffect, useRef } from "react";
import { createFluidSimulation } from "../lib/fluid-simulation";

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;

    const syncMotionPreference = () => {
      dispose?.();
      dispose = undefined;
      if (!reducedMotion.matches) dispose = createFluidSimulation(canvas);
    };
    syncMotionPreference();
    reducedMotion.addEventListener("change", syncMotionPreference);
    // Context restoration invalidates the solver's GPU resources.
    canvas.addEventListener("webglcontextrestored", syncMotionPreference);

    return () => {
      reducedMotion.removeEventListener("change", syncMotionPreference);
      canvas.removeEventListener("webglcontextrestored", syncMotionPreference);
      dispose?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="fluid-cursor" aria-hidden="true" />;
}
