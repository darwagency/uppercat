"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/site";
import Media from "./Media";
import Rail from "./Rail";

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!project) return;
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal(); document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, [project]);
  return <dialog ref={ref} className="project-dialog" aria-labelledby="project-title" onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    {project && <div><button type="button" className="dialog-close" aria-label="Cerrar proyecto" onClick={onClose}>×</button><Media imageKey={project.key} alt={project.title} className="dialog-media" contain /><div className="dialog-info"><div><span className="eyebrow">{project.category}</span><h2 id="project-title">{project.title}</h2></div><p>{project.description}</p></div></div>}
  </dialog>;
}

export default function ProjectGallery({ projects, illustration = false }: { projects: Project[]; illustration?: boolean }) {
  const [selected, setSelected] = useState(projects[0]);
  const [opened, setOpened] = useState<Project | null>(null);
  const card = (project: Project) => <button type="button" className="project-card" key={project.key} aria-label={`${illustration ? "Seleccionar" : "Ampliar"} ${project.title}`} aria-pressed={illustration ? selected.key === project.key : undefined} onClick={() => illustration ? setSelected(project) : setOpened(project)}><Media imageKey={project.key} alt={project.title} /><span className="project-card-caption">{project.title}<span aria-hidden="true">↗</span></span></button>;
  return <>
    {illustration && <div className="illustration-intro content-wrap"><div className="illustration-art"><span className="art-star" aria-hidden="true">✳</span><h2>ILUS<br />TRA<br />CIÓN</h2><Media imageKey="illustrationArt" alt="Universo gráfico de Uppercat" className="optional-art" contain /></div><button type="button" className="feature-viewer" aria-label={`Ampliar ${selected.title}`} onClick={() => setOpened(selected)}><Media imageKey={selected.key} alt={selected.title} /><span>AMPLIAR OBRA ↗</span></button></div>}
    {illustration ? <Rail label="Ilustraciones" className="illustration-rail">{projects.slice(1).map(card)}</Rail> : <>
      <Rail label="Redes sociales / 01" auto>{projects.slice(0, 5).map(card)}</Rail>
      <Rail label="Redes sociales / 02" auto reverse>{projects.slice(5).map(card)}</Rail>
    </>}
    <ProjectDialog project={opened} onClose={() => setOpened(null)} />
  </>;
}
