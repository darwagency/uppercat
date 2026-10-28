import type { Metadata } from "next";
import { PortfolioProvider, PortfolioMotion, PortfolioNavigation, PortfolioCover, IdentityGallery, VisualRail, WorkTile, WebShowcase, IllustrationStage, SocialWall, PortfolioContact } from "@/components/darw/DarwPortfolio";
import { asset } from "@/data/darw";
import Rail from "@/components/Rail";
import clientLogos from "@/data/darw-logos.json";
import s from "./portfolio.module.css";

export const metadata: Metadata = {
  title: { absolute: "Darw — Portafolio creativo" },
  description: "Identidad, packaging, diseño web, ilustración y redes sociales. Portafolio de la agencia Darw, Chile.",
  applicationName: "Darw",
  openGraph: { title: "Darw — Portafolio creativo", description: "Explora los proyectos de identidad, web y comunicación de Darw.", siteName: "Darw", locale: "es_CL", type: "website" },
};

const areas = [
  { id: "identidad", title: "IDENTIDAD", image: "burger-brand" },
  { id: "web", title: "WEB & ECOMMERCE", image: "scandrive-web" },
  { id: "packaging", title: "PACKAGING", image: "burger-box" },
  { id: "redes", title: "REDES SOCIALES", image: "poke-may-1" },
];

export default function Principal2() {
  return <PortfolioProvider><div className={s.site} id="darw-inicio">
    <PortfolioMotion />
    <PortfolioNavigation />
    <main id="contenido">
      <h1 className={s.srOnly}>Darw. Agencia creativa y digital en Chile.</h1>
      <section className={s.hero} aria-label="Portafolio destacado"><PortfolioCover /></section>
      <section className={s.brandBand} aria-label="Marcas de nuestro portafolio"><Rail label="Logos de clientes de Darw" variant="brands" showPauseControl={false} smooth speed={-12}>{clientLogos.map(logo => <div className={s.brandMark} key={logo.slug}><img src={logo.src} srcSet={`${logo.src1x} 1x, ${logo.src} 2x`} alt={logo.name} width={logo.width} height={logo.height} loading="lazy" decoding="async" draggable={false} /></div>)}</Rail></section>
      <section className={s.areas} id="areas" aria-labelledby="areas-title"><div className={s.wrap}>
        <div className={s.areaHeading}><h2 id="areas-title">ÁREAS</h2><span><span className={s.desktopHint}>EXPLORA EL TRABAJO ↘</span><span className={s.mobileHint}>DESLIZA PARA EXPLORAR ↔</span></span></div>
        <div className={s.areaGrid}>{areas.map((area, index) => <a className={s.areaCard} href={"#" + area.id} key={area.id}><span>0{index + 1}</span><h3>{area.title}</h3><b aria-hidden="true">↗</b><img src={asset(area.image)} alt="" width="600" height="650" loading="lazy" /></a>)}</div>
      </div></section>
      <section className={s.social} id="redes" aria-labelledby="social-title">
        <div className={s.wrap}><div className={s.sectionHeading}><h2 id="social-title">REDES SOCIALES</h2></div></div><SocialWall /><p className={s.socialNote}>ARCHIVO DE CAMPAÑAS · PROMOCIONES HISTÓRICAS</p>
      </section>
      <section className={s.identity} id="identidad" aria-labelledby="identity-title"><div className={s.wrap}>
        <div className={s.sectionHeading}><h2 id="identity-title">IDENTIDAD</h2><span>01 / MARCAS</span></div><IdentityGallery />
      </div></section>
      <section className={s.packaging} id="packaging" aria-labelledby="packaging-title">
        <div className={s.wrap}><div className={s.sectionHeading}><h2 id="packaging-title">PACKAGING</h2><span>02 / RURAL BURGER</span></div></div>
        <VisualRail label="Galería de packaging"><div className={s.packGroup}><WorkTile image="burger-packaging" project="rural-burger" label="Rural Burger / Packaging" /><WorkTile image="burger-box" project="rural-burger" label="Rural Burger / Caja" /><WorkTile image="burger-bag" project="rural-burger" label="Rural Burger / Bolsa" /></div><div className={s.packGroup}><WorkTile image="burger-hero" project="rural-burger" label="Rural Burger / Aplicaciones de marca" /></div></VisualRail>
      </section>
      <section className={s.web} id="web" aria-labelledby="web-title"><div className={s.wrap}>
        <div className={s.sectionHeading}><span>03 / DIGITAL</span><h2 id="web-title">WEB & ECOMMERCE</h2></div><WebShowcase />
      </div></section>
      <section className={s.illustration} id="ilustracion" aria-labelledby="illustration-title"><IllustrationStage /></section>
    </main>
    <PortfolioContact />
  </div></PortfolioProvider>;
}
