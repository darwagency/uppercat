"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Rail from "@/components/Rail";
import useAmbientMotion from "@/components/useAmbientMotion";
import { asset, darwContact, darwProjects, type DarwProject } from "@/data/darw";
import s from "@/app/principal-2/portfolio.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const sections = [["darw-inicio", "Inicio"], ["areas", "Áreas"], ["redes", "Redes"], ["identidad", "Identidad"], ["packaging", "Packaging"], ["web", "Web"], ["ilustracion", "Ilustración"], ["contacto", "Contacto"]] as const;
const PortfolioContext = createContext<(id: string, image?: string) => void>(() => {});

export function PortfolioMotion() {
  useEffect(() => {
    const root = document.getElementById("darw-inicio");
    if (!root) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let entrances: IntersectionObserver | undefined;
    let ambient: IntersectionObserver | undefined;
    const targets = root.querySelectorAll<HTMLElement>(`.${s.sectionHeading}, .${s.areaHeading}, .${s.areaCard}, .${s.identityBoard}, .${s.webProject}, .${s.illustrationLayout}, .${s.contactTop}, .${s.contactBottom}`);
    const sections = root.querySelectorAll<HTMLElement>("section, footer");
    const pause = () => { root.dataset.motionPaused = String(document.hidden || Boolean(document.querySelector("dialog[open]"))); };
    const configure = () => {
      entrances?.disconnect(); ambient?.disconnect();
      targets.forEach(target => { delete target.dataset.reveal; });
      sections.forEach(section => { delete section.dataset.ambient; });
      if (media.matches) return;
      entrances = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) { (entry.target as HTMLElement).dataset.reveal = "visible"; entrances?.unobserve(entry.target); } });
      }, { threshold: .08, rootMargin: "0px 0px -25px 0px" });
      targets.forEach((target, index) => {
        target.style.setProperty("--reveal-delay", `${index % 4 * 45}ms`);
        target.dataset.reveal = target.getBoundingClientRect().top < innerHeight ? "visible" : "waiting";
        entrances?.observe(target);
      });
      ambient = new IntersectionObserver(entries => entries.forEach(entry => { (entry.target as HTMLElement).dataset.ambient = String(entry.isIntersecting); }), { rootMargin: "50px" });
      sections.forEach(section => ambient?.observe(section));
      pause();
    };
    configure(); media.addEventListener("change", configure); document.addEventListener("visibilitychange", pause); document.addEventListener("toggle", pause, true);
    return () => { entrances?.disconnect(); ambient?.disconnect(); media.removeEventListener("change", configure); document.removeEventListener("visibilitychange", pause); document.removeEventListener("toggle", pause, true); targets.forEach(target => { delete target.dataset.reveal; target.style.removeProperty("--reveal-delay"); }); sections.forEach(section => { delete section.dataset.ambient; }); delete root.dataset.motionPaused; };
  }, []);
  return null;
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<{ project: DarwProject; image: number } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const open = useCallback((id: string, image?: string) => {
    const project = darwProjects.find(item => item.id === id);
    if (!project) return;
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelected({ project, image: Math.max(0, project.images.findIndex(item => item.src === asset(image ?? ""))) });
  }, []);
  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; trigger.current?.focus({ preventScroll: true }); };
  }, [isOpen]);
  const move = (step: number) => setSelected(current => current ? { ...current, image: (current.image + step + current.project.images.length) % current.project.images.length } : null);
  return <PortfolioContext.Provider value={open}>{children}
    <dialog className={s.dialog} ref={dialog} aria-labelledby="darw-project-title" onCancel={event => { event.preventDefault(); setSelected(null); }} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }} onKeyDown={event => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }}>
      {selected && <><div className={s.dialogBar}><span>DARW / {selected.project.name}</span><button type="button" autoFocus onClick={() => setSelected(null)} aria-label="Cerrar proyecto">Cerrar ×</button></div>
        <div className={s.dialogImage}><img src={selected.project.images[selected.image].src} alt={selected.project.images[selected.image].alt} width="1400" height="1000" /></div>
        <div className={s.dialogControls}><button type="button" aria-label="Imagen anterior" disabled={selected.project.images.length < 2} onClick={() => move(-1)}>←</button><span aria-live="polite">{pad(selected.image + 1)} / {pad(selected.project.images.length)} · {selected.project.images[selected.image].label}</span><button type="button" aria-label="Imagen siguiente" disabled={selected.project.images.length < 2} onClick={() => move(1)}>→</button></div>
        <div className={s.dialogBottom}><div><h2 id="darw-project-title">{selected.project.name}</h2><p>{selected.project.scope}</p></div><a href={selected.project.url} target="_blank" rel="noopener noreferrer">Ver caso completo ↗</a></div>
        <div className={s.thumbnails} aria-label="Imágenes del proyecto">{selected.project.images.map((picture, index) => <button type="button" key={picture.src} aria-label={`Ver ${picture.label}`} aria-pressed={selected.image === index} onClick={() => setSelected({ ...selected, image: index })}><img src={picture.src} alt="" width="90" height="90" loading="lazy" /></button>)}</div>
      </>}
    </dialog>
  </PortfolioContext.Provider>;
}

export function PortfolioNavigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("darw-inicio");
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      let current: string = "darw-inicio";
      for (const [id] of sections) if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) < innerHeight * .4) current = id;
      setActive(current); frame = 0;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); if (header.current?.contains(document.activeElement)) menuButton.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(false); };
    update(); window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", scroll); document.addEventListener("keydown", escape); document.addEventListener("pointerdown", outside);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); };
  }, []);
  return <><header className={s.header} ref={header}><div className={s.navPill}>
    <a href="#darw-inicio" className={s.logo} aria-label="Darw, inicio" onClick={() => setOpen(false)}><img src="/images/darw/darw-logo.svg" alt="Darw" width="138" height="34" /></a>
    <nav className={`${s.mainNav} ${open ? s.menuOpen : ""}`} id="darw-menu" aria-label="Navegación principal de Darw">{[["darw-inicio", "Inicio"], ["areas", "Áreas"], ["redes", "Trabajo"], ["contacto", "Contacto"]].map(([id, label]) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>{label}</a>)}</nav>
    <a className={s.navCta} href="#contacto" onClick={() => setOpen(false)}>Hablemos <span aria-hidden="true">↗</span></a><button type="button" ref={menuButton} className={s.menuButton} aria-expanded={open} aria-controls="darw-menu" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(value => !value)}>{open ? "×" : "☰"}</button>
  </div></header><nav className={s.sideIndex} aria-label="Índice de disciplinas">{sections.map(([id, label], index) => <a key={id} href={`#${id}`} aria-label={label} aria-current={active === id ? "location" : undefined}><span>{label}</span><b>{pad(index)}</b></a>)}</nav></>;
}

const covers = [
  { id: "rural-burger", name: "Rural Burger", lines: ["RURAL", "BURGER"], discipline: "IDENTIDAD + PACKAGING", image: "burger-packaging", detail: "burger-box", tone: "burger", position: "01" },
  { id: "scandrive", name: "Scandrive", lines: ["SCAN", "DRIVE"], discipline: "DISEÑO WEB", image: "scandrive-web", detail: "scandrive-web", tone: "digital", position: "02" },
  { id: "ruralpoke", name: "Ruralpoke", lines: ["RURAL", "POKE"], discipline: "CAMPAÑAS + ILUSTRACIÓN", image: "poke-campaign", detail: "poke-character", tone: "poke", position: "03" },
];

export function PortfolioCover() {
  const openProject = useContext(PortfolioContext);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const { running } = useAmbientMotion(root, !paused);
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setActive(index => (index + 1) % covers.length), 7000); return () => clearInterval(timer); }, [running]);
  const select = (index: number) => { setActive((index + covers.length) % covers.length); setPaused(true); };
  return <div className={s.cover} ref={root} role="region" aria-roledescription="carrusel" aria-label="Proyectos destacados de Darw">
    {covers.map((cover, index) => <div className={`${s.coverSlide} ${s[cover.tone]} ${active === index ? s.coverActive : ""}`} key={cover.id} inert={active !== index} aria-hidden={active !== index}>
      <div className={s.coverCopy}><span className={s.micro}>DARW / PROYECTO {cover.position}</span><h2>{cover.lines[0]}<br /><span>{cover.lines[1]}</span></h2><span className={s.coverDiscipline}>{cover.discipline}</span><button type="button" className={s.coverLink} onClick={() => openProject(cover.id, cover.image)}>Ver proyecto <span aria-hidden="true">↗</span></button></div>
      <button className={s.coverArtwork} type="button" aria-label={`Abrir destacado ${cover.name}`} onClick={() => openProject(cover.id, cover.image)}><img className={s.coverMainImage} src={asset(cover.image)} alt={`Proyecto ${cover.name}: ${cover.discipline.toLowerCase()}`} width="1400" height="1000" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} /><span className={s.coverSticker} aria-hidden="true">{cover.tone === "digital" ? "WWW↗" : "✳"}</span>{cover.tone !== "digital" && <img className={s.coverDetailImage} src={asset(cover.detail)} alt="" width="500" height="500" />}<span className={s.coverOpen} aria-hidden="true">↗</span></button>
    </div>)}
    <div className={s.coverControls}><button type="button" aria-label="Proyecto destacado anterior" onClick={() => select(active - 1)}>←</button><span>{pad(active + 1)} / 03</span><button type="button" aria-label="Proyecto destacado siguiente" onClick={() => select(active + 1)}>→</button><button type="button" className={s.pause} aria-label={paused ? "Reanudar destacados" : "Pausar destacados"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "▶" : "Ⅱ"}</button></div>
  </div>;
}

export function WorkTile({ image, project, label, className = "", contain = false }: { image: string; project: string; label: string; className?: string; contain?: boolean }) {
  const open = useContext(PortfolioContext);
  return <button type="button" className={`${s.workTile} ${contain ? s.contain : ""} ${className}`} onClick={() => open(project, image)} aria-label={`Ampliar ${label}`}><img src={asset(image)} alt={label} width="1200" height="1000" loading="lazy" /><span className={s.tileArrow} aria-hidden="true">↗</span><span className={s.tileLabel}>{label}</span></button>;
}

const identities = [
  { id: "rural-burger", name: "Rural Burger", main: "burger-brand", logo: "burger-logo", detail: "burger-type", color: "#c7d7ab" },
  { id: "fusion-sushi", name: "Fusion Sushi", main: "fusion-application", logo: "fusion-logo", detail: "fusion-colors", color: "#e7b650" },
  { id: "ruralpoke", name: "Ruralpoke", main: "poke-campaign", logo: "poke-logo", detail: "poke-character-2", color: "#eeb49b" },
];

export function IdentityGallery() {
  const [active, setActive] = useState(0);
  const current = identities[active];
  return <><div className={s.identitySelector} role="group" aria-label="Seleccionar identidad">{identities.map((identity, index) => <button key={identity.id} type="button" aria-pressed={index === active} onClick={() => setActive(index)}><span>{pad(index + 1)}</span>{identity.name}<span aria-hidden="true">↗</span></button>)}</div>
    <div className={s.identityBoard} key={current.id} style={{ "--board": current.color } as CSSProperties}><WorkTile image={current.main} project={current.id} label={`${current.name} / Aplicaciones`} className={s.identityMain} /><WorkTile image={current.logo} project={current.id} label={`${current.name} / Logotipo`} contain /><WorkTile image={current.detail} project={current.id} label={`${current.name} / Sistema visual`} contain /></div></>;
}

export function VisualRail({ children, label }: { children: ReactNode; label: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const update = useCallback(() => { const element = rail.current; if (element) setEdges({ start: element.scrollLeft <= 2, end: element.scrollLeft >= element.scrollWidth - element.clientWidth - 2 }); }, []);
  useEffect(() => { const element = rail.current; if (!element) return; const observer = new ResizeObserver(update); observer.observe(element); update(); return () => observer.disconnect(); }, [update, children]);
  const move = (direction: number) => { const element = rail.current; if (element) { const destination = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, element.scrollLeft + direction * element.clientWidth * .8)); element.scrollTo({ left: destination, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); } };
  return <div className={s.railShell}><div className={s.railControls}><button type="button" aria-label={`${label}: anterior`} disabled={edges.start} onClick={() => move(-1)}>←</button><button type="button" aria-label={`${label}: siguiente`} disabled={edges.end} onClick={() => move(1)}>→</button></div><div className={s.visualRail} ref={rail} role="region" aria-label={label} tabIndex={0} onScroll={update} onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>{children}</div></div>;
}

const webProjects = darwProjects.filter(project => project.category[0] === "Web & ecommerce");
export function WebShowcase() {
  const [active, setActive] = useState("scandrive");
  const open = useContext(PortfolioContext);
  return <div className={s.webStack}>{webProjects.map((project, index) => <article className={`${s.webProject} ${active === project.id ? s.webActive : ""}`} style={{ "--web-tone": project.color } as CSSProperties} key={project.id}>
    <h3><button type="button" className={s.webTrigger} id={`web-trigger-${project.id}`} aria-expanded={active === project.id} aria-controls={`web-preview-${project.id}`} onClick={() => setActive(project.id)}><span>{pad(index + 1)}</span><strong>{project.name}</strong><small>{project.scope}</small><b aria-hidden="true">{active === project.id ? "−" : "+"}</b></button></h3>
    <div id={`web-preview-${project.id}`} role="region" aria-labelledby={`web-trigger-${project.id}`} hidden={active !== project.id} className={s.webPanel}><button type="button" className={s.browserMockup} aria-label={`Ampliar web de ${project.name}`} onClick={() => open(project.id)}><span className={s.browserBar}><i /><i /><i /><span>{project.name.toLowerCase()} / web</span><b aria-hidden="true">↗</b></span><img src={project.cover} alt={`Diseño web de ${project.name}`} width="1600" height="1000" loading="lazy" /></button><span className={s.webVertical} aria-hidden="true">DARW / DIGITAL</span></div>
  </article>)}</div>;
}

const characters = [
  { image: "poke-character", project: "ruralpoke", label: "Ruralpoke / Personaje", color: "#d4f29b" },
  { image: "burger-character", project: "rural-burger", label: "Rural Burger / Personaje", color: "#f8c5d6" },
  { image: "poke-character-2", project: "ruralpoke", label: "Ruralpoke / Ilustración", color: "#f8d86a" },
];
export function IllustrationStage() {
  const [active, setActive] = useState(0);
  const current = characters[active];
  return <div className={s.illustrationLayout}><div className={s.illustrationTitle}><span className={s.micro}>04 / ILUSTRACIÓN</span><h2 id="illustration-title" aria-label="Ilustración">ILUS<br />TRA<br />CIÓN<span aria-hidden="true">✳</span></h2><div className={s.characterTabs} role="group" aria-label="Seleccionar ilustración">{characters.map((character, index) => <button key={character.image} type="button" aria-label={`Mostrar ${character.label}`} aria-pressed={active === index} onClick={() => setActive(index)}><img src={asset(character.image)} alt="" width="100" height="100" loading="lazy" /></button>)}</div></div><div className={s.characterStage} style={{ background: current.color }}><span className={s.characterOrbit} aria-hidden="true" /><WorkTile key={current.image} image={current.image} project={current.project} label={current.label} contain /></div></div>;
}

const socialPieces = [
  { image: "poke-may-1", project: "ruralpoke", label: "Ruralpoke / Campaña", brand: "Ruralpoke" },
  { image: "burger-launch-1", project: "rural-burger", label: "Rural Burger / Lanzamiento", brand: "Rural Burger" },
  { image: "poke-birthday", project: "ruralpoke", label: "Ruralpoke / Cumpleaños", brand: "Ruralpoke" },
  { image: "fusion-story", project: "fusion-sushi", label: "Fusion Sushi / Stories", brand: "Fusion Sushi" },
  { image: "poke-cyber", project: "ruralpoke", label: "Ruralpoke / Cyber", brand: "Ruralpoke" },
  { image: "burger-launch-2", project: "rural-burger", label: "Rural Burger / Lanzamiento", brand: "Rural Burger" },
  { image: "poke-may-2", project: "ruralpoke", label: "Ruralpoke / Campaña", brand: "Ruralpoke" },
  { image: "poke-story", project: "ruralpoke", label: "Ruralpoke / Stories", brand: "Ruralpoke" },
];
export function SocialWall() {
  const [brand, setBrand] = useState("Todas");
  const pieces = socialPieces.filter(piece => brand === "Todas" || piece.brand === brand);
  return <><div className={s.socialFilters} role="group" aria-label="Filtrar redes por marca">{["Todas", "Ruralpoke", "Rural Burger", "Fusion Sushi"].map(item => <button key={item} type="button" aria-pressed={brand === item} onClick={() => setBrand(item)}>{item}</button>)}</div><span className={s.srOnly} role="status">{pieces.length} {pieces.length === 1 ? "pieza" : "piezas"} de {brand === "Todas" ? "todas las marcas" : brand}</span><div className={s.socialMotion} key={brand}>{pieces.length > 3 ? (pieces.length >= 8 ? [pieces.filter((_, index) => index % 2 === 0), pieces.filter((_, index) => index % 2 === 1)] : [pieces]).map((row, index) => <div className={s.socialRow} key={index}><Rail label={index === 0 ? "Campañas de redes, fila superior" : "Campañas de redes, fila inferior"} variant={index === 0 ? "social-top" : "social-bottom"} smooth speed={index === 0 ? -14 : 14}>{row.map(piece => <div className={s.socialCard} key={piece.image}><WorkTile image={piece.image} project={piece.project} label={piece.label} /></div>)}</Rail></div>) : <div className={s.socialSelection}>{pieces.map(piece => <WorkTile key={piece.image} image={piece.image} project={piece.project} label={piece.label} />)}</div>}</div></>;
}

export function PortfolioContact() {
  const whatsapp = `https://wa.me/${darwContact.phone}?text=${encodeURIComponent("Hola Darw, vi su portafolio y me gustaría conversar sobre un proyecto.")}`;
  return <footer className={s.contact} id="contacto"><div className={s.contactTop}><span className={s.micro}>¿UN PROYECTO?</span><a href={whatsapp} target="_blank" rel="noopener noreferrer"><h2>HABLEMOS</h2><span aria-hidden="true">↗</span></a></div><div className={s.contactBottom}><a href="#darw-inicio" aria-label="Darw, volver al inicio"><img src="/images/darw/darw-logo.svg" alt="Darw" width="180" height="44" /></a><a href={`mailto:${darwContact.email}`}>{darwContact.email} ↗</a><a href={darwContact.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><span>© 2026 / CHILE</span><a href="/">Uppercat ↗</a></div></footer>;
}
