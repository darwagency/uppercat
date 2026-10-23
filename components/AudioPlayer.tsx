"use client";
import { useRef, useState } from "react";

export default function AudioPlayer() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(38);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const toggle = async () => {
    const audio = ref.current; if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    audio.volume = volume / 100; audio.muted = muted;
    try { await audio.play(); setError(""); } catch { setError("No se pudo reproducir la música. Intenta nuevamente."); }
  };
  return <div className="lofi-player" role="group" aria-label="Reproductor Lo-Fi"><button type="button" className="lofi-play" aria-label={playing ? "Pausar música" : "Reproducir música"} aria-pressed={playing} onClick={toggle}>{playing ? "Ⅱ" : "▶"}</button><span className="lofi-label">LO-FI <small>HIP HOP</small></span><button type="button" className="lofi-mute" aria-label={muted ? "Activar sonido" : "Silenciar música"} aria-pressed={muted} onClick={() => { const value = !muted; setMuted(value); if (ref.current) ref.current.muted = value; }}>{muted ? "×" : "♪"}</button><input className="lofi-volume" type="range" min="0" max="100" value={volume} aria-label="Volumen de la música" onChange={(e) => { const value = Number(e.target.value); setVolume(value); setMuted(false); if (ref.current) { ref.current.volume = value / 100; ref.current.muted = false; } }} /><audio ref={ref} src="/audio/lofi-original.mp3" loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setError("El audio no está disponible."); }} /><span className="lofi-error" role="status">{error}</span></div>;
}
