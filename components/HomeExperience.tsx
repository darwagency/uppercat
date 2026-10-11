"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import FluidRevealImage from "./FluidRevealImage";
import GalleryScrollMotion from "./GalleryScrollMotion";
import { createGalleryScrollController, type GalleryScrollController } from "@/lib/gallery-scroll";

const LOOP_COPIES = 5;
const MIDDLE_COPY = Math.floor(LOOP_COPIES / 2);

export default function HomeExperience() {
  const [active, setActive] = useState(0);
  const [intro, setIntro] = useState(true);
  const [progress, setProgress] = useState(0);
  const galleryRef = useRef<HTMLElement>(null);
  const scrollControllerRef = useRef<GalleryScrollController | null>(null);

  useEffect(() => {
    if (window.sessionStorage.getItem("portfolio-intro-seen")) {
      setIntro(false);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (time: number) => {
      const value = Math.min(100, Math.round(((time - start) / 1050) * 100));
      setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick);
      else {
        window.sessionStorage.setItem("portfolio-intro-seen", "true");
        window.setTimeout(() => setIntro(false), 320);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const sets = Array.from(gallery.querySelectorAll<HTMLElement>(".project-gallery-set"));
    const nodes = Array.from(gallery.querySelectorAll<HTMLElement>(".project-card"));
    const desktop = window.matchMedia("(min-width: 901px)");
    let frame = 0;
    let cycleHeight = 1;
    let origin = 0;
    let middle = 0;
    let phase = 0;
    let looping = desktop.matches;
    let directInput = false;

    const measure = () => {
      const first = sets[0].getBoundingClientRect().top + window.scrollY;
      cycleHeight = Math.max(1, sets[1].getBoundingClientRect().top + window.scrollY - first);
      // Keep the mobile introduction visible until the gallery fills the screen.
      origin = desktop.matches ? 0 : first;
      middle = origin + MIDDLE_COPY * cycleHeight;
    };
    const moveInstantly = (top: number) => {
      const shift = top - window.scrollY;
      if (Math.abs(shift) < 0.5) return;
      window.scrollTo({ top, behavior: "instant" });
      // Native scroll events are queued; update motion synchronously before paint.
      window.dispatchEvent(new CustomEvent("gallery:recenter", { detail: { shift } }));
    };
    const normalize = () => {
      if (!looping && window.scrollY >= origin) looping = true;
      if (!looping) return;
      const within = ((window.scrollY - origin) % cycleHeight + cycleHeight) % cycleHeight;
      moveInstantly(middle + within);
      phase = within / cycleHeight;
    };
    const update = () => {
      frame = 0;
      // Let keyboard focus reach content outside the repeating gallery.
      const focused = document.activeElement;
      if (directInput || !focused?.closest(".site-footer, .skip-link")) normalize();
      const center = window.innerHeight * 0.48;
      let nearest = 0;
      let distance = Infinity;
      nodes.forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        const delta = Math.abs(rect.top + rect.height / 2 - center);
        if (delta < distance) { distance = delta; nearest = index; }
      });
      setActive((current) => current === nearest % projects.length ? current : nearest % projects.length);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      if (looping || desktop.matches) {
        looping = true;
        moveInstantly(middle + phase * cycleHeight);
      }
      onScroll();
    };
    const onDirectInput = () => { directInput = true; };
    const onFocus = () => { directInput = false; };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) directInput = true;
    };
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    desktop.addEventListener("change", onResize);
    window.addEventListener("wheel", onDirectInput, { passive: true });
    window.addEventListener("touchstart", onDirectInput, { passive: true });
    document.addEventListener("focusin", onFocus);
    window.addEventListener("keydown", onKeyDown);
    const controller = createGalleryScrollController();
    scrollControllerRef.current = controller;
    return () => {
      controller.dispose();
      scrollControllerRef.current = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      desktop.removeEventListener("change", onResize);
      window.removeEventListener("wheel", onDirectInput);
      window.removeEventListener("touchstart", onDirectInput);
      document.removeEventListener("focusin", onFocus);
      window.removeEventListener("keydown", onKeyDown);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const navigateToProject = (event: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const card = document.getElementById(slug);
    const sets = galleryRef.current?.querySelectorAll<HTMLElement>(".project-gallery-set");
    if (!card || !sets || sets.length < 2) return;
    event.preventDefault();
    const cycle = sets[1].getBoundingClientRect().top - sets[0].getBoundingClientRect().top;
    const rect = card.getBoundingClientRect();
    const target = window.scrollY + rect.top + rect.height / 2 - window.innerHeight * 0.48;
    const base = MIDDLE_COPY * cycle;
    const top = base + ((target - base) % cycle + cycle) % cycle;
    if (window.location.hash !== `#${slug}`) window.history.pushState(window.history.state, "", `#${slug}`);
    if (scrollControllerRef.current) scrollControllerRef.current.scrollTo(top);
    else window.scrollTo({ top, behavior: "instant" });
  };

  return (
    <>
      <GalleryScrollMotion copies={LOOP_COPIES} />
      <div className={`intro-screen ${intro ? "is-active" : ""}`} aria-hidden="true"><div className="intro-grain"/><div className="intro-core"><span className="intro-symbol">◕</span><span>{progress}%</span></div></div>
      <main id="contenido" className="home-page">
        <div className="home-intro">
          <div className="hero-copy clip-reveal">
            <span className="hero-overline">PORTAFOLIO INDEPENDIENTE <span>—</span> EST. 2026</span>
            <h1>CREATIVE<br />DEVELOPER<span className="heading-dot">.</span></h1>
            <p>Experiencias digitales con ideas claras,<br />movimiento fluido y mucho por descubrir.</p>
          </div>
          <a className="scroll-cue text-link" href="#proyectos"><span className="scroll-cue-icon" aria-hidden="true">↓</span> Desliza para explorar</a>
        </div>
        <section id="proyectos" className="project-gallery" ref={galleryRef} aria-label="Proyectos seleccionados">
          {Array.from({ length: LOOP_COPIES }, (_, copy) => (
            <div className="project-gallery-set" key={copy} aria-hidden={copy !== MIDDLE_COPY}>
              {projects.map((project, index) => (
                <article className="project-card is-visible" id={copy === MIDDLE_COPY ? project.slug : undefined} key={project.slug} data-project-index={index}>
                  <Link href={`/work/${project.slug}`} aria-label={`Ver proyecto ${project.title}`} className="project-image-link" data-motion-index={copy * projects.length + index} tabIndex={copy === MIDDLE_COPY ? 0 : -1}>
                    <FluidRevealImage src={project.colorImage} alt={project.alt} priority={copy === MIDDLE_COPY && index === 0} backgroundColor={project.color} />
                  </Link>
                  <div className="project-caption"><span>{String(index + 1).padStart(2, "0")} / {project.category}</span><span>{project.year}</span></div>
                </article>
              ))}
            </div>
          ))}
        </section>
        <aside className="project-index" aria-label="Índice de proyectos"><span className="index-label">Índice <span>({String(projects.length).padStart(2, "0")})</span></span><ol>{projects.map((project, index) => <li key={project.slug}><a className={active === index ? "is-active" : ""} href={`#${project.slug}`} onClick={(event) => navigateToProject(event, project.slug)} aria-current={active === index ? "true" : undefined}>{project.title}</a></li>)}</ol><span className="index-progress"><span style={{ transform: `translateY(${active * 100}%)` }} /></span></aside>
      </main>
    </>
  );
}
