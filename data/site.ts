export const site = {
  name: "Uppercat",
  email: "uppercat@gmail.com",
  whatsapp: "56933457166",
  whatsappLabel: "+56 9 3345 7166",
  description: "Diseño con carácter. Packaging, cartas de menú, ilustración, redes sociales y diseño interior por Uppercat.",
  // Agregar únicamente perfiles oficiales, por ejemplo { label: "Instagram", url: "https://..." }.
  socials: [] as { label: string; url: string }[],
};

export const sections = [
  ["inicio", "Inicio"], ["habilidades", "Habilidades"], ["packaging", "Packaging"],
  ["menus", "Diseño menú"], ["ilustracion", "Ilustración"], ["redes", "Redes sociales"],
  ["interior", "Diseño interior"], ["resenas", "Testimonios"], ["contacto", "Contacto"],
] as const;

export const services = [
  { title: "DISEÑO DE MENÚ", anchor: "menus", number: "01", cover: "/images/skills/menus.webp" },
  { title: "ILUSTRACIÓN", anchor: "ilustracion", number: "02", cover: "/images/skills/ilustracion.webp" },
  { title: "PACKAGING", anchor: "packaging", number: "03", cover: "/images/skills/packaging.webp" },
  { title: "REDES SOCIALES", anchor: "redes", number: "04", cover: "/images/skills/redes.webp" },
  { title: "DISEÑO INTERIOR", anchor: "interior", number: "05", cover: "/images/skills/interior.webp" },
];

export const promotions = [
  { key: "hero1", tag: "ESTUDIO CREATIVO / 01", title: "IDEAS CON\nCARÁCTER.", copy: "Diseño que conecta tu marca con su propia forma de ver el mundo.", message: "Hola Uppercat, me interesa conversar sobre un proyecto de diseño." },
  { key: "hero2", tag: "DISEÑO + IDENTIDAD / 02", title: "TU MARCA,\nOTRA MIRADA.", copy: "Del packaging a la carta. Una identidad en cada detalle.", message: "Hola Uppercat, quiero consultar por packaging o diseño de menú." },
  { key: "hero3", tag: "ILUSTRACIÓN + ARTE / 03", title: "TRAZOS QUE\nDICEN ALGO.", copy: "Ilustración, contenido y espacios con una voz propia.", message: "Hola Uppercat, me interesa un proyecto de ilustración o contenido visual." },
];

export type Project = { key: string; title: string; category: string; description: string };
export const menus: Project[] = Array.from({ length: 4 }, (_, i) => ({
  key: `menu${i + 1}`, title: `Carta ${String(i + 1).padStart(2, "0")}`,
  category: "DISEÑO DE MENÚ", description: "Selección de diseño de cartas. La fotografía y la ficha de este proyecto están en preparación.",
}));
export const illustrations: Project[] = [
  { key: "illustrationMain", title: "Ilustración destacada", category: "ILUSTRACIÓN / DESTACADO", description: "Una mirada al universo visual de Uppercat. Obra y ficha en preparación." },
  ...Array.from({ length: 8 }, (_, i) => ({ key: `illustration${i + 1}`, title: `Ilustración ${String(i + 1).padStart(2, "0")}`, category: "ILUSTRACIÓN", description: "Obra en preparación para el portafolio. Próximamente: técnica, contexto del encargo y año." })),
];
export const socialProjects: Project[] = Array.from({ length: 10 }, (_, i) => ({
  key: `social${i + 1}`, title: `Diseño social ${String(i + 1).padStart(2, "0")}`,
  category: "REDES SOCIALES", description: "Selección de contenido visual. Próximamente: marca, objetivo de campaña, piezas y año.",
}));

export type Product = { key: string; name: string; category: string; price: string; description: string };
// Reemplazar por datos reales antes de presentar estos artículos como productos disponibles.
export const products: Product[] = Array.from({ length: 5 }, (_, i) => ({
  key: `shop${i + 1}`, name: `Producto ${String(i + 1).padStart(2, "0")}`, category: `COLECCIÓN / ${String(i + 1).padStart(2, "0")}`,
  price: "Consultar precio", description: [
    "Descripción breve del producto. Cambia este texto por la información real.",
    "Agrega aquí el material, tamaño o las características que quieras destacar.",
    "Una descripción corta para presentar el artículo de manera atractiva.",
    "Completa este espacio con el detalle principal de tu producto.",
    "Este es el quinto producto de la tienda. Personaliza el nombre y el valor.",
  ][i],
}));

// Solo se publican marcas y testimonios completos y autorizados.
export const brands: { key: string; name: string }[] = [];
export const reviews: { key: string; name: string; brand: string; quote: string }[] = [];

export function whatsappUrl(message: string, phone = site.whatsapp): string | null {
  const normalized = phone.replace(/\D/g, "");
  return /^[1-9]\d{7,14}$/.test(normalized) ? `https://wa.me/${normalized}?text=${encodeURIComponent(message)}` : null;
}
export const contactUrl = whatsappUrl("Hola Uppercat, vi tu portafolio y me gustaría conversar sobre un proyecto.") || `mailto:${site.email}`;
export const productUrl = (product: Product) => whatsappUrl(`Hola Uppercat, me interesa ${product.name}. ¿Me cuentas su precio, disponibilidad y opciones de entrega?`) || `mailto:${site.email}?subject=${encodeURIComponent(product.name)}`;
