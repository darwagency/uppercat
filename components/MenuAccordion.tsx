"use client";
import { useState } from "react";
import { menus } from "@/data/site";
import Media from "./Media";

export default function MenuAccordion() {
  const [selected, setSelected] = useState(0);
  return <div className="menus-accordion content-wrap">{menus.map((menu, i) => <article className={`menu-item tone-${i} ${selected === i ? "is-open" : ""}`} key={menu.key}>
    <h3><button type="button" id={`menu-button-${i}`} aria-expanded={selected === i} aria-controls={`menu-panel-${i}`} onClick={() => setSelected(i)}><span className="menu-number">0{i + 1} / CARTA</span><span>{menu.title}</span><span aria-hidden="true">{selected === i ? "−" : "+"}</span></button></h3>
    <div role="region" id={`menu-panel-${i}`} aria-labelledby={`menu-button-${i}`} hidden={selected !== i}><Media imageKey={menu.key} alt={`Diseño de menú / ${menu.title}`} contain /><p>{menu.description}</p></div>
  </article>)}</div>;
}
