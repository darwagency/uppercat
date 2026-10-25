"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { asset, darwCategories, darwContact, darwProjects, darwServices, type DarwCategory, type DarwProject } from "@/data/darw";
import s from "@/app/principal-2/darw.module.css";

const StudioContext = createContext<{ openProject: (id: string, image?: number) => void; modalOpen: boolean }>({ openProject: () => {}, modalOpen: false });
const pad = (n: number) => String(n).padStart(2, "0");
const navItems = [["trabajo", "Trabajo"], ["servicios", "Qué hacemos"], ["contenido-marcas", "Contenido"], ["estudio", "Estudio"]] as const;

export function DarwProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<{ project: DarwProject; image: number } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const openProject = useCallback((id: string, image = 0) => {
    const project = darwProjects.find(item => item.id === id);
    if (!project) return;
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelected({ project, image: Math.min(Math.max(0, image), project.images.length - 1) });
  }, []);
  const modalOpen = selected !== null;
  useEffect(() => {
    if (!modalOpen) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [modalOpen]);
  const move = (direction: number) => setSelected(current => current ? { ...current, image: (current.image + direction + current.project.images.length) % current.project.images.length } : null);
  const close = () => setSelected(null);
  return <StudioContext.Provider value={{ openProject, modalOpen }}>{children}
    <dialog className={s.projectDialog} ref={dialog} aria-labelledby="project-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }}>
      {selected && <div className={s.dialogPanel}>
        <div className={s.dialogTop}><span>DARW / ARCHIVO DE PROYECTOS</span><button type="button" onClick={close} aria-label="Cerrar proyecto" autoFocus>Cerrar <span aria-hidden="true">×</span></button></div>
        <div className={s.dialogGrid}><div className={s.dialogMedia}><img key={selected.project.images[selected.image].src} src={selected.project.images[selected.image].src} alt={selected.project.images[selected.image].alt} width="1400" height="1100" /><div className={s.imageControls}><button type="button" aria-label="Imagen anterior" disabled={selected.project.images.length < 2} onClick={() => move(-1)}>←</button><span aria-live="polite">{pad(selected.image + 1)} / {pad(selected.project.images.length)}</span><button type="button" aria-label="Imagen siguiente" disabled={selected.project.images.length < 2} onClick={() => move(1)}>→</button></div></div>
          <div className={s.dialogInfo}><span className={s.kicker}>{selected.project.scope}</span><h2 id="project-title">{selected.project.name}</h2><p className={s.dialogLine}>{selected.project.line}</p><p>{selected.project.description}</p><span className={s.imageLabel} aria-live="polite">{selected.project.images[selected.image].label}</span><div className={s.thumbnails} aria-label="Imágenes del proyecto">{selected.project.images.map((img, i) => <button type="button" key={img.src} aria-label={`Ver imagen ${i + 1}: ${img.label}`} aria-pressed={selected.image === i} onClick={() => setSelected({ ...selected, image: i })}><img src={img.src} alt="" width="100" height="100" loading="lazy" /></button>)}</div><a className={s.textLink} href={selected.project.url} target="_blank" rel="noopener noreferrer">Ver caso en darw.cl <span aria-hidden="true">↗</span></a><small className={s.dialogNote}>Archivo del proyecto. Las promociones y condiciones que aparecen en las piezas son históricas.</small></div>
        </div>
      </div>}
    </dialog>
  </StudioContext.Provider>;
}

export function DarwHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      progress.current?.style.setProperty("--progress", String(total > 0 ? scrollY / total : 0));
      let current = "";
      navItems.forEach(([id]) => { if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) < innerHeight * .4) current = id; });
      setActive(current);
      frame = 0;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenuOpen(false); if (header.current?.contains(document.activeElement)) toggle.current?.focus(); } };
    const outside = (e: PointerEvent) => { if (!header.current?.contains(e.target as Node)) setMenuOpen(false); };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); };
  }, []);
  return <header className={s.header} ref={header}><div className={`${s.headerInner} ${s.wrap}`}><a className={s.logo} href="#darw-inicio" aria-label="Darw, inicio" onClick={() => setMenuOpen(false)}><img src="/images/darw/darw-logo.svg" alt="Darw" width="138" height="34" /></a><nav id="darw-navigation" className={`${s.nav} ${menuOpen ? s.navOpen : ""}`} aria-label="Navegación de Darw">{navItems.map(([id, name]) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={() => setMenuOpen(false)}>{name}<span aria-hidden="true">↗</span></a>)}</nav><a className={s.headerCta} href="#hablemos" onClick={() => setMenuOpen(false)}>Hablemos <span aria-hidden="true">↗</span></a><button className={s.menuButton} type="button" ref={toggle} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} aria-controls="darw-navigation" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? "×" : "☰"}</button></div><div className={s.scrollProgress} ref={progress} /></header>;
}

const heroSlides = [
  { id: "rural-burger", image: "burger-packaging", title: "Rural Burger", subtitle: "IDENTIDAD QUE SE VIVE", alt: "Packaging de Rural Burger aplicado a cajas y bolsas" },
  { id: "scandrive", image: "scandrive-web", title: "Scandrive", subtitle: "DISEÑO QUE CONECTA", alt: "Diseño digital para Scandrive" },
  { id: "rural-burger", image: "burger-box", title: "Del diseño a tus manos.", subtitle: "PACKAGING CON PERSONALIDAD", alt: "Caja de hamburguesa y papas de Rural Burger", imageIndex: 2 },
];
export function HeroShowcase() {
  const { openProject, modalOpen } = useContext(StudioContext);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    const syncVisibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 });
    if (stage.current) observer.observe(stage.current);
    syncMotion(); syncVisibility();
    media.addEventListener("change", syncMotion); document.addEventListener("visibilitychange", syncVisibility);
    return () => { observer.disconnect(); media.removeEventListener("change", syncMotion); document.removeEventListener("visibilitychange", syncVisibility); };
  }, []);
  const playing = !paused && !hovered && !focused && visible && pageVisible && !reducedMotion && !modalOpen;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, [playing]);
  const selectSlide = (index: number) => { setActive(index); setPaused(true); };
  return <div className={s.showcase} ref={stage}>
    <div className={s.featured} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      {heroSlides.map((slide, index) => <button key={index} type="button" className={`${s.featureSlide} ${index === active ? s.slideActive : ""}`} aria-label={`Explorar ${slide.title}`} aria-hidden={index !== active} tabIndex={index === active ? 0 : -1} inert={index !== active} onClick={() => openProject(slide.id, slide.imageIndex ?? 0)}><img src={asset(slide.image)} alt={slide.alt} width="1600" height="1000" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} /><span className={s.featureShade} /><span className={s.featureLabel}><small>{slide.subtitle}</small><strong>{slide.title}</strong></span><span className={s.openCircle} aria-hidden="true">↗</span></button>)}
      <div className={s.slideControls}><span>{pad(active + 1)} / 03</span><div>{heroSlides.map((slide, i) => <button type="button" key={i} aria-label={`Mostrar destacado ${i + 1}: ${slide.title}`} aria-pressed={i === active} onClick={() => selectSlide(i)} />)}</div><button type="button" className={s.pauseButton} aria-label={paused ? "Reanudar destacados" : "Pausar destacados"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "▶" : "Ⅱ"}</button></div>
    </div>
    <button className={s.characterCard} type="button" onClick={() => openProject("ruralpoke")}><span className={s.cardTopline}>PERSONAJES CON CARÁCTER <span aria-hidden="true">↗</span></span><img src={asset("poke-character")} alt="Personaje de Ruralpoke" width="700" height="800" /><span className={s.characterName}>Hola,<br /><em>personalidad.</em></span><span className={s.cardBottomline}>DARW × RURALPOKE <span>ILUSTRACIÓN</span></span></button>
  </div>;
}

export function ProjectArchive() {
  const { openProject } = useContext(StudioContext);
  const [category, setCategory] = useState<DarwCategory>("Todo");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [showAll, setShowAll] = useState(false);
  const filtered = darwProjects.filter(project => category === "Todo" || project.category.includes(category));
  const shown = showAll ? filtered : filtered.slice(0, 6);
  return <>
    <div className={s.archiveToolbar}><div className={s.filters} role="group" aria-label="Filtrar proyectos">{darwCategories.map(item => <button type="button" aria-pressed={category === item} onClick={() => { setCategory(item); setShowAll(false); }} key={item}>{item}<sup>{item === "Todo" ? darwProjects.length : darwProjects.filter(p => p.category.includes(item)).length}</sup></button>)}</div><div className={s.viewToggle} role="group" aria-label="Vista del portafolio"><button type="button" aria-label="Ver cuadrícula" aria-pressed={layout === "grid"} onClick={() => setLayout("grid")}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 2h6v6H2zM12 2h6v6h-6zM2 12h6v6H2zM12 12h6v6h-6z" /></svg></button><button type="button" aria-label="Ver lista" aria-pressed={layout === "list"} onClick={() => setLayout("list")}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 3h16v2H2zM2 9h16v2H2zM2 15h16v2H2z" /></svg></button></div></div>
    <p className={s.srOnly} role="status">{filtered.length} proyectos en {category}</p>
    <div className={`${s.projectGrid} ${layout === "list" ? s.projectList : ""}`}>
      {shown.map((project, index) => <article key={project.id} className={s.projectCard} style={{ "--project-color": project.color } as CSSProperties}>
        <button type="button" className={s.projectButton} aria-label={`Abrir proyecto ${project.name}`} onClick={() => openProject(project.id)}>
          <div className={`${s.projectImage} ${project.id === "ruralpoke" ? s.illustrationImage : ""} ${project.category[0] === "Web & ecommerce" ? s.webImage : ""}`}><img src={project.cover} alt={project.images[0].alt} width="1000" height="800" loading="lazy" /><span className={s.projectIndex}>{pad(index + 1)}</span><span className={s.projectPeek}>Ver proyecto ↗</span>{project.id === "ruralpoke" && <span className={s.pokeWord} aria-hidden="true">¡HOLA!</span>}</div>
          <div className={s.projectCaption}><div><h3>{project.name}</h3><span>{project.scope}</span></div><span className={s.projectArrow} aria-hidden="true">↗</span></div>
        </button>
      </article>)}
    </div>
    <div className={s.archiveFooter}><span>{pad(shown.length)} / {pad(filtered.length)} PROYECTOS</span>{filtered.length > 6 ? <button type="button" className={s.outlineButton} aria-expanded={showAll} onClick={() => setShowAll(value => !value)}>{showAll ? "Mostrar selección" : "Ver todos los proyectos"}<span aria-hidden="true">{showAll ? "−" : "+"}</span></button> : <a href="https://darw.cl/portfolio" target="_blank" rel="noopener noreferrer" className={s.textLink}>Explorar el archivo de Darw ↗</a>}<span>MUCHO MÁS QUE UNA BUENA IMAGEN.</span></div>
  </>;
}

export function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const { openProject } = useContext(StudioContext);
  const selected = darwServices[active];
  return <div className={s.serviceExplorer}><div className={s.serviceList}>{darwServices.map((service, i) => <div className={`${s.serviceRow} ${active === i ? s.serviceActive : ""}`} key={service.name}><h3><button type="button" id={`service-trigger-${i}`} aria-expanded={i === active} aria-controls={`service-detail-${i}`} onClick={() => setActive(i)}><span>{pad(i + 1)}</span>{service.name}<b aria-hidden="true">{i === active ? "−" : "+"}</b></button></h3><div className={s.serviceDetail} id={`service-detail-${i}`} role="region" aria-labelledby={`service-trigger-${i}`} hidden={active !== i}><p>{service.detail}</p><div>{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></div>)}</div><button className={`${s.serviceVisual} ${active === 2 ? s.servicePoster : ""}`} type="button" onClick={() => openProject(selected.project, active === 2 ? 1 : active === 3 ? 2 : active === 0 ? 1 : 0)} aria-label={`Ver ejemplo de ${selected.name}`}><span className={s.serviceVisualTop}>ASÍ SE VE EN LA PRÁCTICA <span aria-hidden="true">↗</span></span><img key={selected.image} src={asset(selected.image)} alt={`Trabajo Darw de ${selected.name}`} width="1000" height="900" loading="lazy" /><span className={s.serviceVisualBottom}>{selected.note}<small>EXPLORAR PROYECTO ↗</small></span></button></div>;
}

const contentPieces = [
  { image: "burger-launch-1", brand: "Rural Burger", type: "Lanzamiento", project: "rural-burger", index: 4 },
  { image: "poke-may-1", brand: "Ruralpoke", type: "Campaña", project: "ruralpoke", index: 1 },
  { image: "poke-character", brand: "Ruralpoke", type: "Personaje", project: "ruralpoke", index: 0 },
  { image: "poke-birthday", brand: "Ruralpoke", type: "Campaña", project: "ruralpoke", index: 3 },
  { image: "burger-launch-2", brand: "Rural Burger", type: "Lanzamiento", project: "rural-burger", index: 5 },
  { image: "poke-cyber", brand: "Ruralpoke", type: "Cyber", project: "ruralpoke", index: 6 },
  { image: "poke-story", brand: "Ruralpoke", type: "Stories", project: "ruralpoke", index: 5 },
];
export function ContentStrip() {
  const { openProject } = useContext(StudioContext);
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [end, setEnd] = useState(false);
  const scroll = (direction: number) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * .68, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <><div className={`${s.railToolbar} ${s.wrap}`}><span>UN VISTAZO AL DÍA A DÍA <span aria-hidden="true">→</span></span><div><button type="button" aria-label="Contenido anterior" disabled={position <= 1} onClick={() => scroll(-1)}>←</button><button type="button" aria-label="Contenido siguiente" disabled={end} onClick={() => scroll(1)}>→</button></div></div><div className={s.contentRail} ref={rail} role="region" aria-label="Galería de campañas, desplázate horizontalmente" tabIndex={0} onScroll={() => { const el = rail.current; if (el) { setPosition(el.scrollLeft); setEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2); } }} onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight") { event.preventDefault(); scroll(1); } if (event.key === "ArrowLeft") { event.preventDefault(); scroll(-1); } }}>
      {contentPieces.map((piece, i) => <button className={`${s.contentPiece} ${piece.type === "Personaje" ? s.characterPiece : ""}`} type="button" key={piece.image} onClick={() => openProject(piece.project, piece.index)} aria-label={`Ampliar ${piece.type} de ${piece.brand}, pieza ${i + 1}`}><div><img src={asset(piece.image)} alt={`${piece.type} de ${piece.brand}`} width="700" height="875" loading="lazy" /><span aria-hidden="true">↗</span></div><span className={s.pieceCaption}><strong>{piece.brand}</strong><small>{piece.type} / {pad(i + 1)}</small></span></button>)}
    </div></>;
}

export function ContactStudio() {
  const [interests, setInterests] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const message = `Hola Darw, vi su portafolio y me gustaría conversar sobre ${interests.length ? interests.join(", ").toLowerCase() : "un proyecto"}.${context.trim() ? `\n\n${context.trim()}` : ""}`;
  const whatsapp = `https://wa.me/${darwContact.phone}?text=${encodeURIComponent(message)}`;
  const email = `mailto:${darwContact.email}?subject=${encodeURIComponent("Un nuevo proyecto con Darw")}&body=${encodeURIComponent(message)}`;
  return <section className={s.contact} id="hablemos" aria-labelledby="contact-title"><div className={s.wrap}><span className={s.kicker}>05 / TU PRÓXIMA IDEA</span><div className={s.contactGrid}><div><h2 id="contact-title">¿Hacemos<br /><span className={s.serif}>algo bueno?</span></h2><p>Cuéntanos qué tienes en mente.<br />Le damos forma juntos.</p><a className={s.contactEmail} href={`mailto:${darwContact.email}`}>{darwContact.email} ↗</a></div><div className={s.contactBrief}><fieldset><legend>ESTOY PENSANDO EN…</legend><div className={s.interests}>{["Una marca", "Una web", "Un ecommerce", "Contenido", "Packaging", "Lo conversamos"].map(item => <button type="button" key={item} aria-pressed={interests.includes(item)} onClick={() => setInterests(items => items.includes(item) ? items.filter(value => value !== item) : [...items, item])}>{item}<span aria-hidden="true">{interests.includes(item) ? "✓" : "+"}</span></button>)}</div></fieldset><label htmlFor="project-context">TU IDEA EN UNA LÍNEA <span>(OPCIONAL)</span></label><textarea id="project-context" value={context} onChange={event => setContext(event.target.value)} maxLength={1000} rows={2} placeholder="Mi proyecto necesita…" /><div className={s.contactActions}><a className={s.darkButton} href={whatsapp} target="_blank" rel="noopener noreferrer">Conversemos por WhatsApp <span aria-hidden="true">↗</span></a><a href={email} className={s.emailAlternative}>Prefiero escribir un email ↗</a></div><small>Preparamos tu mensaje. Tú decides cuándo enviarlo.</small></div></div></div></section>;
}
