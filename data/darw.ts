export type DarwCategory = "Todo" | "Identidad" | "Web & ecommerce" | "Contenido" | "Packaging";
export type DarwImage = { src: string; alt: string; label: string };
export type DarwProject = { id: string; name: string; line: string; category: DarwCategory[]; scope: string; color: string; cover: string; description: string; url: string; images: DarwImage[] };
export const asset = (name: string) => `/images/darw/${name}.webp`;
const picture = (name: string, alt: string, label: string): DarwImage => ({ src: asset(name), alt, label });

export const darwProjects: DarwProject[] = [
  {
    id: "rural-burger", name: "Rural Burger", line: "Una marca con mucho ritmo.",
    category: ["Identidad", "Packaging", "Contenido"], scope: "Identidad · Packaging · Lanzamiento", color: "#d4dfb8", cover: asset("burger-packaging"),
    description: "Un universo gastronómico que conecta identidad, personajes, envases y contenido. La misma personalidad, desde la primera publicación hasta la última mordida.",
    url: "https://darw.cl/gastronomia/rural-burger",
    images: [picture("burger-packaging", "Caja y aplicaciones de packaging Rural Burger", "Packaging / Aplicación de marca"), picture("burger-brand", "Patrón con logotipo y personajes Rural Burger", "Identidad / Sistema gráfico"), picture("burger-box", "Caja de hamburguesa y papas Rural Burger", "Packaging / Caja"), picture("burger-bag", "Bolsa de papel de Rural Burger", "Packaging / Bolsa"), picture("burger-launch-1", "Primera pieza de lanzamiento Rural Burger", "Contenido / Lanzamiento"), picture("burger-launch-2", "Segunda pieza de lanzamiento Rural Burger", "Contenido / Lanzamiento")],
  },
  {
    id: "ruralpoke", name: "Ruralpoke", line: "Personalidad que abre el apetito.",
    category: ["Contenido", "Identidad"], scope: "Dirección creativa · Campañas · Personaje", color: "#f3b294", cover: asset("poke-character"),
    description: "Una voz propia para el día a día: campañas, historias y un personaje que acompaña a la marca en todos sus formatos.",
    url: "https://darw.cl/gastronomia/ruralpoke",
    images: [picture("poke-character", "Personaje ilustrado de Ruralpoke", "Ilustración / Personaje"), picture("poke-may-1", "Campaña Órdenes del comandante de Ruralpoke", "Campaña / 21 de mayo"), picture("poke-may-2", "Segunda pieza de campaña 21 de mayo", "Campaña / Continuación"), picture("poke-birthday", "Campaña de cumpleaños Ruralpoke", "Campaña / Cumpleaños"), picture("poke-campaign", "Campaña Ruralpoke llega donde sea", "Campaña / Alcance"), picture("poke-story", "Historia de apertura de Ruralpoke", "Contenido / Stories"), picture("poke-cyber", "Pieza Cyber Poke", "Campaña / Cyber")],
  },
  {
    id: "scandrive", name: "Scandrive", line: "Lo técnico también puede ser claro.",
    category: ["Web & ecommerce"], scope: "Diseño web · Experiencia digital", color: "#d5dde0", cover: asset("scandrive-web"),
    description: "Una experiencia digital para el mundo automotriz. Diseño de interfaz y presentación de servicios conectados en un mismo recorrido.",
    url: "https://darw.cl/portfolio?caso=scandrive#archivo", images: [picture("scandrive-web", "Presentación de la experiencia digital de Scandrive", "Web / Experiencia digital")],
  },
  {
    id: "fusion-sushi", name: "Fusion Sushi", line: "Todo un mundo alrededor del sushi.",
    category: ["Identidad", "Contenido"], scope: "Identidad · Dirección de arte", color: "#ede3c7", cover: asset("fusion-logo"),
    description: "Un sistema visual para una marca gastronómica de Quillota. Identidad, promociones y comunicación cotidiana con un lenguaje compartido.",
    url: "https://darw.cl/gastronomia/fusion-sushi-quillota", images: [picture("fusion-logo", "Identidad visual de Fusion Sushi", "Branding / Identidad"), picture("fusion-colors", "Paleta cromática de Fusion Sushi", "Branding / Color"), picture("fusion-application", "Aplicación del sistema visual de Fusion Sushi", "Branding / Aplicaciones"), picture("fusion-story", "Historia de delivery de Fusion Sushi", "Contenido / Stories")],
  },
  {
    id: "equilibrium", name: "Equilibrium", line: "Un recorrido más simple hacia el cuidado.",
    category: ["Web & ecommerce"], scope: "Diseño web · Salud", color: "#d1e4dd", cover: asset("equilibrium-web"),
    description: "Una web para el centro de salud en Chonchi, Chiloé. Servicios y especialidades ordenados para facilitar la búsqueda de información.",
    url: "https://darw.cl/portfolio/equilibrium-chonchi", images: [picture("equilibrium-web", "Página web de Equilibrium Centro de Salud Integral", "Web / Página principal"), picture("equilibrium-logo", "Logotipo Equilibrium", "Marca / Identidad")],
  },
  {
    id: "sushi-torii", name: "Sushi Torii", line: "Del antojo al pedido.",
    category: ["Web & ecommerce"], scope: "Ecommerce · Experiencia de compra", color: "#f2c4b5", cover: asset("torii-web"),
    description: "La experiencia de Sushi Torii llevada al entorno digital. Un catálogo que acerca el producto a la decisión de compra.",
    url: "https://darw.cl/portfolio/torii-sushi-ecommerce-chiloe", images: [picture("torii-web", "Ficha de producto del ecommerce de Sushi Torii", "Ecommerce / Producto")],
  },
  {
    id: "monte-verde", name: "Colegio Monte Verde", line: "Una comunidad, muchas formas de conectar.",
    category: ["Web & ecommerce"], scope: "Diseño web · Educación", color: "#e5dfc7", cover: asset("monteverde-web"),
    description: "El colegio de Castro, Chiloé, en una experiencia digital que reúne vida escolar, información institucional y admisión.",
    url: "https://darw.cl/portfolio?caso=colegio-monte-verde#archivo", images: [picture("monteverde-web", "Sitio web de Colegio Monte Verde", "Web / Comunidad educativa")],
  },
  {
    id: "fuego-de-patio", name: "Fuego de Patio", line: "Una experiencia que empieza antes de la mesa.",
    category: ["Web & ecommerce"], scope: "Diseño web · Gastronomía", color: "#e8c9a8", cover: asset("fuego-web"),
    description: "Una presencia digital para mostrar la propuesta gastronómica y los eventos de Fuego de Patio.",
    url: "https://darw.cl/portfolio?caso=fuego-de-patio#archivo", images: [picture("fuego-web", "Sitio web de Fuego de Patio", "Web / Gastronomía y eventos")],
  },
];
export const darwCategories: DarwCategory[] = ["Todo", "Identidad", "Web & ecommerce", "Contenido", "Packaging"];
export const darwContact = { email: "darwagency@gmail.com", phone: "56926341222", instagram: "https://www.instagram.com/darw.cl/" };
export const darwServices = [
  { name: "Estrategia & marca", note: "Una dirección propia.", detail: "Estrategia, identidad visual, dirección de arte y sistemas gráficos que acompañan a tu marca cuando crece.", tags: ["Estrategia", "Branding", "Dirección de arte"], project: "rural-burger", image: "burger-brand" },
  { name: "Web & ecommerce", note: "Experiencias que funcionan.", detail: "Diseñamos y desarrollamos recorridos digitales para presentar, conectar y vender con claridad.", tags: ["UX / UI", "Desarrollo web", "Ecommerce"], project: "scandrive", image: "scandrive-web" },
  { name: "Contenido & campañas", note: "Ideas que salen al mundo.", detail: "Un lenguaje visual que se adapta a cada formato. Campañas, redes sociales y personajes con personalidad.", tags: ["Social media", "Campañas", "Ilustración"], project: "ruralpoke", image: "poke-may-1" },
  { name: "Packaging & gráfica", note: "La marca también se toca.", detail: "Llevamos la identidad al mundo físico: envases, cartas y aplicaciones que hacen reconocible cada encuentro.", tags: ["Packaging", "Diseño editorial", "Gráfica"], project: "rural-burger", image: "burger-box" },
];
