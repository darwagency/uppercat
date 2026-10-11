import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import ProjectCarousel from "@/components/ProjectCarousel";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project?.title ?? "Proyecto" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const nextProject = projects[(index + 1) % projects.length];

  return (
    <main className="project-page" id="contenido">
      <header className="case-page-header">
        <span className="case-page-eyebrow">{project.eyebrow}</span>
        <h1 className="project-title clip-reveal">{project.title}</h1>
      </header>
      <ProjectCarousel project={project} />
      <div className="case-page-bottom">
        <p className="case-page-lead">{project.description}</p>
        <dl className="case-page-meta">
          <div><dt>Año</dt><dd>{project.year}</dd></div>
          <div><dt>Tipo</dt><dd>{project.category}</dd></div>
          <div><dt>Servicios</dt><dd>{project.services.join(", ")}</dd></div>
        </dl>
        <Link className="case-next" href={`/work/${nextProject.slug}`} aria-label={`Siguiente proyecto: ${nextProject.title}`}>
          <span><small>Siguiente proyecto</small><strong>{nextProject.title} ↗</strong></span>
          <span className="case-next-image"><Image src={nextProject.colorImage} alt="" fill sizes="110px" /></span>
        </Link>
      </div>
    </main>
  );
}
