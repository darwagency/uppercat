"use client";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/site";
import Media from "./Media";
import Rail from "./Rail";

function ProjectDialog({ project,onClose }: {project:Project|null;onClose:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!project) return;
    const dialog=ref.current, previous=document.activeElement as HTMLElement|null, overflow=document.body.style.overflow;
    dialog?.showModal(); document.body.style.overflow="hidden";
    return () => { dialog?.close(); document.body.style.overflow=overflow; previous?.focus({preventScroll:true}); };
  },[project]);
  return <dialog ref={ref} className="project-dialog" aria-labelledby="project-title" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    {project && <><button type="button" className="project-modal-close" aria-label="Cerrar proyecto" onClick={onClose}>×</button><div className="project-modal-media"><Media imageKey={project.key} alt={project.title} caption="IMAGEN DEL PROYECTO" contain /></div><div className="project-modal-info"><div><span className="modal-kicker">{project.category}</span><h2 id="project-title">{project.title}</h2></div><p>{project.description}</p></div></>}
  </dialog>;
}
export default function ProjectGallery({projects,illustration=false}:{projects:Project[];illustration?:boolean}) {
  const [selected,setSelected]=useState(projects[0]);
  const [opened,setOpened]=useState<Project|null>(null);
  const card=(project:Project)=>{const n=project.key.replace(/\D/g,"");return <Media key={project.key} imageKey={project.key} alt={project.title} caption={(illustration?"ILUSTRACIÓN / ":"POST ")+n.padStart(2,"0")} className={illustration?"illustration-thumb":"social-post"} label={(illustration?"Mostrar ilustración ":"Ampliar post ")+n} selected={illustration?selected.key===project.key:undefined} onClick={()=>illustration?setSelected(project):setOpened(project)} />;};
  return <>
    {illustration && <div className="illustration-intro content-wrap"><div className="illustration-art" aria-label="Ilustración"><span aria-hidden="true" className="illu-abstract illu-abstract-one" /><span aria-hidden="true" className="illu-abstract illu-abstract-two" /><strong>ILUS<br />TRA<br />CIÓN</strong><span aria-hidden="true" className="illu-star">✳</span><span className="illu-caption">ILUSTRACIÓN</span><Media imageKey="illustrationArt" alt="Gráfica de título para ilustración" className="artwork-slot" /></div><Media imageKey={selected.key} alt={selected.title} caption={selected.key==="illustrationMain"?"ILUSTRACIÓN / PRINCIPAL":"ILUSTRACIÓN / "+selected.key.replace(/\D/g,"").padStart(2,"0")} className="illustration-feature feature-viewer" label="Ampliar ilustración seleccionada" contain onClick={()=>setOpened(selected)} /></div>}
    {illustration ? <Rail label="Miniaturas de ilustración, selección de proyecto" variant="illustrations">{projects.slice(1).map(card)}</Rail> : <><Rail label="Redes sociales, fila superior" variant="social-top">{[0,1,2,3,7].map(i=>card(projects[i]))}</Rail><Rail label="Redes sociales, fila inferior" variant="social-bottom">{[4,5,6,8,9].map(i=>card(projects[i]))}</Rail></>}
    <ProjectDialog project={opened} onClose={()=>setOpened(null)} />
  </>;
}
