"use client";
import { useEffect, useRef, useState } from "react";
import { menus } from "@/data/site";
import Media from "./Media";

export default function MenuAccordion() {
  const [selected,setSelected] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (track.current && deck.current) {
        const travel = Math.max(1,track.current.offsetHeight - deck.current.offsetHeight);
        const progress = Math.max(0,Math.min(1,-track.current.getBoundingClientRect().top / travel));
        setSelected(Math.round(progress * 3));
      }
      frame = 0;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll",scroll,{passive:true}); window.addEventListener("resize",scroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll",scroll); window.removeEventListener("resize",scroll); };
  }, []);
  const select = (i: number) => {
    setSelected(i);
    if (!track.current || !deck.current) return;
    const target = scrollY + track.current.getBoundingClientRect().top + Math.max(0,track.current.offsetHeight - deck.current.offsetHeight) * i / 3;
    window.scrollTo({top:target,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
  };
  return <div className="menu-scroll-track" ref={track}><div className="menus-accordion" ref={deck} aria-label="Cuatro proyectos de menú; cambia al desplazar la página">{menus.map((menu,i) => <article key={menu.key} className={"menu-item " + ["tone-one","tone-two","tone-three","tone-four"][i] + (selected === i ? " is-open" : "")}>
    <h3><button className="menu-trigger" type="button" id={"menu-button-" + i} aria-expanded={selected === i} aria-controls={"menu-panel-" + i} onClick={() => select(i)}><span className="menu-number">0{i + 1} / CARTA</span><span className="menu-name">NOMBRE PROYECTO 0{i + 1}</span><span className="menu-symbol" aria-hidden="true">{selected === i ? "−" : "+"}</span></button></h3>
    <div className="menu-panel" role="region" id={"menu-panel-" + i} aria-labelledby={"menu-button-" + i} aria-hidden={selected !== i}><Media imageKey={menu.key} alt={"Diseño de menú proyecto " + (i + 1)} caption={"FOTO DEL MENÚ 0" + (i + 1)} className="menu-photo" contain /></div>
  </article>)}</div></div>;
}
