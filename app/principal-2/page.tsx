import type { Metadata } from "next";
import { DarwProvider, DarwHeader, HeroShowcase, ProjectArchive, ServiceExplorer, ContentStrip, ContactStudio } from "@/components/darw/DarwExperience";
import { darwContact } from "@/data/darw";
import s from "./darw.module.css";

export const metadata: Metadata = {
  title: { absolute: "Darw — Marcas, web y contenido" },
  description: "Estudio creativo y digital en Chile. Explora nuestros proyectos de identidad, web, ecommerce, packaging y campañas.",
  applicationName: "Darw",
  openGraph: { title: "Darw — Marcas, web y contenido", description: "Proyectos de identidad, web, packaging y campañas de Darw.", siteName: "Darw", locale: "es_CL", type: "website" },
};

export default function Principal2() {
  return <DarwProvider><div className={s.site} id="darw-inicio">
    <DarwHeader />
    <main id="contenido">
      <section className={`${s.hero} ${s.wrap}`} aria-labelledby="darw-title">
        <div className={s.eyebrow}><span><i className={s.statusDot} /> AGENCIA CREATIVA & DIGITAL</span><span>CHILE</span></div>
        <div className={s.heroTitle}><h1 id="darw-title"><span>Marcas. Web.</span> <em>Contenido.</em></h1><a href="#trabajo" className={s.textLink}>Ver proyectos <span aria-hidden="true">↙</span></a></div>
        <HeroShowcase />
      </section>
      <section className={s.brandStrip} aria-label="Marcas de nuestro portafolio"><div className={s.wrap}><span>CLIENTES</span><div className={s.brandNames}><b>Rural Burger</b><b>RuralPoké</b><b>FUSION<span>SUSHI</span></b><b>equilibrium</b><b>SCANDRIVE</b><b>TORII</b></div></div></section>
      <section className={`${s.work} ${s.wrap}`} id="trabajo" aria-labelledby="work-title"><div className={s.sectionHead}><span className={s.sectionNumber} aria-hidden="true">01</span><h2 id="work-title">Proyectos<span className={s.serif}>.</span></h2></div><ProjectArchive /></section>
      <section className={s.services} id="servicios" aria-labelledby="services-title"><div className={s.wrap}><div className={s.sectionHead}><span className={s.sectionNumber} aria-hidden="true">02</span><h2 id="services-title">Servicios<span className={s.serif}>.</span></h2><span className={s.largeArrow} aria-hidden="true">↘</span></div><ServiceExplorer /></div></section>
      <section className={s.contentSection} id="contenido-marcas" aria-labelledby="content-title"><div className={`${s.sectionHead} ${s.wrap}`}><span className={s.sectionNumber} aria-hidden="true">03</span><h2 id="content-title">Campañas & <span className={s.serif}>redes.</span></h2></div><ContentStrip /><div className={`${s.archiveNote} ${s.wrap}`}><span>ARCHIVO DE CAMPAÑAS · PROMOCIONES HISTÓRICAS</span></div></section>
      <section className={`${s.studio} ${s.wrap}`} id="estudio" aria-labelledby="studio-title"><div className={s.studioIntro}><span className={s.kicker}>04 / NOSOTROS</span><h2 id="studio-title">Somos <span className={s.serif}>Darw.</span></h2><p>Agencia creativa y digital en Chile.</p><a href="https://darw.cl/nosotros" className={s.textLink} target="_blank" rel="noopener noreferrer">Conócenos <span aria-hidden="true">↗</span></a></div><div className={s.studioProcess}><div className={s.studioGraphic} aria-hidden="true"><span>IDEA</span><span className={s.processStar}>✳</span><span>ACCIÓN</span></div>{[{n:"01",title:"Estrategia",text:"Definimos objetivos y una dirección para tu marca."},{n:"02",title:"Diseño",text:"Creamos la identidad y sus aplicaciones."},{n:"03",title:"Desarrollo",text:"Construimos y publicamos la experiencia digital."}].map(step=><details key={step.n} className={s.processStep}><summary><span>{step.n}</span><h3>{step.title}</h3><span className={s.plus} aria-hidden="true">+</span></summary><p>{step.text}</p></details>)}</div></section>
      <ContactStudio />
    </main>
    <footer className={s.footer}><div className={s.wrap}><div className={s.footerTop}><a href="#darw-inicio" aria-label="Darw, volver al inicio"><img src="/images/darw/darw-logo.svg" alt="Darw" width="140" height="34" /></a><a href={darwContact.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={`mailto:${darwContact.email}`}>Email ↗</a><a href="#darw-inicio">Volver arriba ↑</a></div><div className={s.footerBottom}><span>© 2026 DARW AGENCY · CHILE</span><a href="/">Ver Uppercat ↗</a></div></div></footer>
  </div></DarwProvider>;
}
