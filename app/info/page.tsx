import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Sobre mí" };

export default function InfoPage() {
  return (
    <main className="info-page" id="contenido">
      <div className="info-heading clip-reveal"><h1>SOBRE<br className="mobile-break" /> MÍ<span className="heading-dot">.</span></h1></div>
      <div className="info-visual" aria-label="Composición abstracta azul">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="visual-caption">CREAR / EXPLORAR / CONSTRUIR</div>
        <div className="visual-mark">U<span>✳</span></div>
      </div>
      <div className="info-bottom">
        <div className="info-copy">
          <p>Soy Uppercat, desarrollador creativo. Construyo experiencias digitales que se sienten tan bien como se ven.</p>
          <p>Me interesa el punto donde el diseño, el código y el movimiento se encuentran. Cada proyecto es una oportunidad de transformar una idea estática en algo vivo, intuitivo y memorable.</p>
          <p>Trabajo junto a estudios, marcas y personas que quieren hacer algo diferente en la web.</p>
          <Link href="/#proyectos" className="underlined-link">Explorar proyectos <span aria-hidden="true">↗</span></Link>
        </div>
        <dl className="info-list">
          <div><dt>Enfoque</dt><dd>Desarrollo creativo<br />Dirección digital<br />Motion & interacción</dd></div>
          <div><dt>Herramientas</dt><dd>Next.js, React<br />TypeScript, CSS<br />WebGL, GSAP, Figma</dd></div>
        </dl>
      </div>
    </main>
  );
}
