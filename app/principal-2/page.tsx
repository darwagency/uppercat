import type { Metadata } from "next";
import { DarwProvider, DarwHeader, HeroShowcase, ProjectArchive, ServiceExplorer, ContentStrip, ContactStudio } from "@/components/darw/DarwExperience";
import { darwContact } from "@/data/darw";
import s from "./darw.module.css";

export const metadata: Metadata = {
  title: { absolute: "Darw — Ideas que se hacen ver" },
  description: "Estudio creativo y digital en Chile. Explora nuestros proyectos de identidad, web, ecommerce, packaging y campañas.",
  applicationName: "Darw",
  openGraph: { title: "Darw — Ideas que se hacen ver", description: "Estrategia, diseño y experiencias digitales. Trabajo seleccionado de Darw.", siteName: "Darw", locale: "es_CL", type: "website" },
};

export default function Principal2() {
  return <DarwProvider><div className={s.site} id="darw-inicio">
    <DarwHeader />
    <main id="contenido">
      <section className={`${s.hero} ${s.wrap}`} aria-labelledby="darw-title">
        <div className={s.eyebrow}><span><i className={s.statusDot} /> ESTUDIO CREATIVO & DIGITAL</span><span>DESDE CHILE. CON OTRA MIRADA.</span></div>
        <div className={s.heroTitle}><h1 id="darw-title">Ideas que<br />se hacen <em>ver.</em></h1><div className={s.heroAside}><span className={s.asterisk} aria-hidden="true">✳</span><p>Unimos estrategia, diseño<br />y tecnología para darle<br />vida a tu marca.</p><a href="#trabajo" className={s.textLink}>El trabajo habla <span aria-hidden="true">↙</span></a></div></div>
        <HeroShowcase />
        <div className={s.heroFoot}><span>BUENAS IDEAS. EN EL MUNDO REAL.</span><a href="#trabajo">EXPLORAR EL ESTUDIO <span aria-hidden="true">↓</span></a><span>PORTAFOLIO / 2026</span></div>
      </section>
      <section className={s.brandStrip} aria-label="Marcas de nuestro portafolio"><div className={s.wrap}><span>EN BUENA<br />COMPAÑÍA</span><div className={s.brandNames}><b>Rural Burger</b><b>RuralPoké</b><b>FUSION<span>SUSHI</span></b><b>equilibrium</b><b>SCANDRIVE</b><b>TORII</b></div></div></section>
      <section className={`${s.work} ${s.wrap}`} id="trabajo" aria-labelledby="work-title"><div className={s.sectionHead}><div><span className={s.kicker}>01 / TRABAJO SELECCIONADO</span><h2 id="work-title">Menos promesas.<br /><span className={s.serif}>Más proyectos.</span></h2></div><p>Identidades, experiencias y piezas<br />que cuentan quién está detrás.<br /><span>Entra, mira de cerca.</span></p></div><ProjectArchive /></section>
      <section className={s.services} id="servicios" aria-labelledby="services-title"><div className={s.wrap}><div className={s.sectionHead}><div><span className={s.kicker}>02 / LO QUE HACEMOS</span><h2 id="services-title">De la primera idea<br />al <span className={s.serif}>último detalle.</span></h2></div><span className={s.largeArrow} aria-hidden="true">↘</span></div><ServiceExplorer /></div></section>
      <section className={s.contentSection} id="contenido-marcas" aria-labelledby="content-title"><div className={`${s.sectionHead} ${s.wrap}`}><div><span className={s.kicker}>03 / MARCAS EN MOVIMIENTO</span><h2 id="content-title">Imposible<br /><span className={s.serif}>pasar de largo.</span></h2></div><p>Campañas, personajes y contenido.<br />Una voz propia en cada formato.</p></div><ContentStrip /><div className={`${s.archiveNote} ${s.wrap}`}><span>DEL ARCHIVO DE DARW — RURALPOKE & RURAL BURGER</span><span>Las promociones mostradas corresponden al período de cada proyecto.</span></div></section>
      <section className={`${s.studio} ${s.wrap}`} id="estudio" aria-labelledby="studio-title"><div className={s.studioIntro}><span className={s.kicker}>04 / EL ESTUDIO</span><h2 id="studio-title">Una mirada.<br />Muchas formas<br />de <span className={s.serif}>hacer.</span></h2><p>Somos Darw. Conectamos la estrategia con lo que tu marca muestra, dice y hace. Del primer boceto a la experiencia completa.</p><a href="https://darw.cl/nosotros" className={s.textLink} target="_blank" rel="noopener noreferrer">Conoce más de Darw <span aria-hidden="true">↗</span></a></div><div className={s.studioProcess}><div className={s.studioGraphic} aria-hidden="true"><span>IDEA</span><span className={s.processStar}>✳</span><span>ACCIÓN</span><small>ESTRATEGIA + CREATIVIDAD + TECNOLOGÍA</small></div>{[{n:"01",title:"Entender antes de crear",text:"Conversamos sobre tu negocio, su contexto y lo que necesitas resolver."},{n:"02",title:"Encontrar una dirección",text:"Damos forma a una idea y definimos un lenguaje que pueda crecer contigo."},{n:"03",title:"Hacer que suceda",text:"Diseñamos, desarrollamos y llevamos la marca a sus puntos de contacto."}].map(step=><details key={step.n} className={s.processStep}><summary><span>{step.n}</span><h3>{step.title}</h3><span className={s.plus} aria-hidden="true">+</span></summary><p>{step.text}</p></details>)}</div></section>
      <ContactStudio />
    </main>
    <footer className={s.footer}><div className={s.wrap}><div className={s.footerTop}><a href="#darw-inicio" aria-label="Darw, volver al inicio"><img src="/images/darw/darw-logo.svg" alt="Darw" width="140" height="34" /></a><span>ESTRATEGIA. DISEÑO. MUNDO REAL.</span><a href={darwContact.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={`mailto:${darwContact.email}`}>Email ↗</a><a href="#darw-inicio">Volver arriba ↑</a></div><div className={s.footerBottom}><span>© 2026 DARW AGENCY</span><span>HECHO CON INTENCIÓN, DESDE CHILE.</span><a href="/">Ver Uppercat ↗</a></div></div></footer>
  </div></DarwProvider>;
}
