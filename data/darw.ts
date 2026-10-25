export type DarwCategory = "Todo" | "Identidad" | "Web & ecommerce" | "Contenido" | "Packaging";
export type DarwImage = { src: string; alt: string; label: string };
export type DarwProject = { id: string; name: string; category: DarwCategory[]; scope: string; color: string; cover: string; description: string; url: string; images: DarwImage[] };
export const asset = (name: string) => `/images/darw/${name}.webp`;
const picture = (name: string, alt: string, label: string): DarwImage => ({ src: asset(name), alt, label });

export const darwProjects: DarwProject[] = [
  {
    id: "rural-burger", name: "Rural Burger",
    category: ["Identidad", "Packaging", "Contenido"], scope: "Identidad · Packaging · Lanzamiento", color: "#d4dfb8", cover: asset("burger-packaging"),
    description: "Un universo gastronómico que conecta identidad, personajes, envases y contenido. La misma personalidad, desde la primera publicación hasta la última mordida.",
    url: "https://darw.cl/gastronomia/rural-burger",
    images: [picture("burger-packaging", "Caja y aplicaciones de packaging Rural Burger", "Packaging / Aplicación de marca"), picture("burger-brand", "Patrón con logotipo y personajes Rural Burger", "Identidad / Sistema gráfico"), picture("burger-box", "Caja de hamburguesa y papas Rural Burger", "Packaging / Caja"), picture("burger-bag", "Bolsa de papel de Rural Burger", "Packaging / Bolsa"), picture("burger-launch-1", "Primera pieza de lanzamiento Rural Burger", "Contenido / Lanzamiento"), picture("burger-launch-2", "Segunda pieza de lanzamiento Rural Burger", "Contenido / Lanzamiento"), picture("burger-character", "Personaje ilustrado de Rural Burger", "Ilustración / Personaje"), picture("burger-logo", "Logotipo de Rural Burger", "Identidad / Logotipo"), picture("burger-type", "Tipografía de la marca Rural Burger", "Identidad / Tipografía"), picture("burger-hero", "Aplicaciones de marca de Rural Burger", "Identidad / Aplicaciones")],
  },
  {
    id: "ruralpoke", name: "Ruralpoke",
    category: ["Contenido", "Identidad"], scope: "Campañas · Ilustración", color: "#f3b294", cover: asset("poke-character"),
    description: "Una voz propia para el día a día: campañas, historias y un personaje que acompaña a la marca en todos sus formatos.",
    url: "https://darw.cl/gastronomia/ruralpoke",
    images: [picture("poke-character", "Personaje ilustrado de Ruralpoke", "Ilustración / Personaje"), picture("poke-may-1", "Campaña Órdenes del comandante de Ruralpoke", "Campaña / 21 de mayo"), picture("poke-may-2", "Segunda pieza de campaña 21 de mayo", "Campaña / Continuación"), picture("poke-birthday", "Campaña de cumpleaños Ruralpoke", "Campaña / Cumpleaños"), picture("poke-campaign", "Campaña Ruralpoke llega donde sea", "Campaña / Alcance"), picture("poke-story", "Historia de apertura de Ruralpoke", "Contenido / Stories"), picture("poke-cyber", "Pieza Cyber Poke", "Campaña / Cyber"), picture("poke-character-2", "Segunda ilustración del personaje Ruralpoke", "Ilustración / Personaje alternativo"), picture("poke-logo", "Logotipo de la marca Ruralpoke", "Identidad / Logotipo")],
  },
  {
    id: "scandrive", name: "Scandrive",
    category: ["Web & ecommerce"], scope: "Diseño web", color: "#d5dde0", cover: asset("scandrive-web"),
    description: "Una experiencia digital para el mundo automotriz. Diseño de interfaz y presentación de servicios conectados en un mismo recorrido.",
    url: "https://darw.cl/portfolio?caso=scandrive#archivo", images: [picture("scandrive-web", "Presentación de la experiencia digital de Scandrive", "Web / Experiencia digital")],
  },
  {
    id: "fusion-sushi", name: "Fusion Sushi",
    category: ["Identidad", "Contenido"], scope: "Identidad · Dirección de arte", color: "#ede3c7", cover: asset("fusion-logo"),
    description: "Un sistema visual para una marca gastronómica de Quillota. Identidad, promociones y comunicación cotidiana con un lenguaje compartido.",
    url: "https://darw.cl/gastronomia/fusion-sushi-quillota", images: [picture("fusion-logo", "Identidad visual de Fusion Sushi", "Branding / Identidad"), picture("fusion-colors", "Paleta cromática de Fusion Sushi", "Branding / Color"), picture("fusion-application", "Aplicación del sistema visual de Fusion Sushi", "Branding / Aplicaciones"), picture("fusion-story", "Historia de delivery de Fusion Sushi", "Contenido / Stories")],
  },
  {
    id: "equilibrium", name: "Equilibrium",
    category: ["Web & ecommerce"], scope: "Diseño web · Salud", color: "#d1e4dd", cover: asset("equilibrium-web"),
    description: "Una web para el centro de salud en Chonchi, Chiloé. Servicios y especialidades ordenados para facilitar la búsqueda de información.",
    url: "https://darw.cl/portfolio/equilibrium-chonchi", images: [picture("equilibrium-web", "Página web de Equilibrium Centro de Salud Integral", "Web / Página principal"), picture("equilibrium-logo", "Logotipo Equilibrium", "Marca / Identidad")],
  },
  {
    id: "sushi-torii", name: "Sushi Torii",
    category: ["Web & ecommerce"], scope: "Ecommerce", color: "#f2c4b5", cover: asset("torii-web"),
    description: "La experiencia de Sushi Torii llevada al entorno digital. Un catálogo que acerca el producto a la decisión de compra.",
    url: "https://darw.cl/portfolio/torii-sushi-ecommerce-chiloe", images: [picture("torii-web", "Ficha de producto del ecommerce de Sushi Torii", "Ecommerce / Producto")],
  },
  {
    id: "monte-verde", name: "Colegio Monte Verde",
    category: ["Web & ecommerce"], scope: "Diseño web · Educación", color: "#e5dfc7", cover: asset("monteverde-web"),
    description: "El colegio de Castro, Chiloé, en una experiencia digital que reúne vida escolar, información institucional y admisión.",
    url: "https://darw.cl/portfolio?caso=colegio-monte-verde#archivo", images: [picture("monteverde-web", "Sitio web de Colegio Monte Verde", "Web / Comunidad educativa")],
  },
  {
    id: "fuego-de-patio", name: "Fuego de Patio",
    category: ["Web & ecommerce"], scope: "Diseño web · Gastronomía", color: "#e8c9a8", cover: asset("fuego-web"),
    description: "Una presencia digital para mostrar la propuesta gastronómica y los eventos de Fuego de Patio.",
    url: "https://darw.cl/portfolio?caso=fuego-de-patio#archivo", images: [picture("fuego-web", "Sitio web de Fuego de Patio", "Web / Gastronomía y eventos")],
  },
];
export const darwContact = { email: "darwagency@gmail.com", phone: "56926341222", instagram: "https://www.instagram.com/darw.cl/" };
