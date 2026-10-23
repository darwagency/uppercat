"use client";

import { useRef, useState } from "react";
import useAmbientMotion from "./useAmbientMotion";

export default function Ticker() {
  const container = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const { running } = useAmbientMotion(container, !paused);
  return <div ref={container} className="ticker shop-ticker" aria-label="Catálogo de Uppercat">
    <div className="ticker-track" aria-hidden="true" style={{ animationPlayState: running ? "running" : "paused" }}>
      {[0, 1].map(copy => <div className="ticker-group" key={copy}>{Array.from({ length: 4 }, (_, i) => <span key={i}>DESCUBRE LA COLECCIÓN UPPERCAT ✳</span>)}</div>)}
    </div>
    <button type="button" className="focus-only" aria-label={(paused ? "Activar" : "Pausar") + " cinta de la colección"} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Activar" : "Pausar"} cinta</button>
  </div>;
}
