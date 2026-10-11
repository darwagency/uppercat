export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  image: string;
  colorImage: string;
  detailImage: string;
  alt: string;
  eyebrow: string;
  statement: string;
  description: string;
  services: string[];
  color: string;
};

export const projects: Project[] = [
  {
    slug: "luma-studio",
    title: "Luma Studio",
    category: "Estudio creativo",
    year: "2026",
    image: "/images/luma-studio.png",
    colorImage: "/images/luma-studio-color.png",
    detailImage: "/images/luma-detail.png",
    alt: "Equipo creativo trabajando alrededor de un portátil",
    eyebrow: "01 / IDENTIDAD DIGITAL",
    statement: "Ideas que toman forma.",
    description:
      "Una presencia digital para un estudio que trabaja entre ideas, imágenes y movimiento. Una experiencia editorial que pone el proceso creativo en primer plano.",
    services: ["Dirección digital", "Desarrollo web", "Interacción"],
    color: "#e9e8e0",
  },
  {
    slug: "mesa",
    title: "Mesa",
    category: "Gastronomía",
    year: "2025",
    image: "/images/mesa.png",
    colorImage: "/images/mesa-color.png",
    detailImage: "/images/mesa-detail.png",
    alt: "Mesa vista desde arriba con platos y cerámica artesanal",
    eyebrow: "02 / EXPERIENCIA DE MARCA",
    statement: "El gusto de compartir.",
    description:
      "Un lugar para compartir. Diseñamos una experiencia cálida y directa que convierte ingredientes cotidianos en una historia visual memorable.",
    services: ["Concepto", "Diseño web", "Desarrollo"],
    color: "#e7e1d5",
  },
  {
    slug: "habitar",
    title: "Habitar",
    category: "Arquitectura",
    year: "2025",
    image: "/images/habitar.png",
    colorImage: "/images/habitar-color.png",
    detailImage: "/images/habitar-detail.png",
    alt: "Arquitectos junto a un edificio contemporáneo de hormigón",
    eyebrow: "03 / PORTAFOLIO DIGITAL",
    statement: "Espacios para vivir.",
    description:
      "Una plataforma para explorar la relación entre espacios, personas y paisaje. La navegación pausada deja que cada proyecto respire.",
    services: ["Estrategia", "Diseño", "Animación"],
    color: "#dcded9",
  },
  {
    slug: "objeto",
    title: "Objeto",
    category: "Producto y cultura",
    year: "2024",
    image: "/images/objeto.png",
    colorImage: "/images/objeto-color.png",
    detailImage: "/images/objeto-detail.png",
    alt: "Frasco de perfume y empaque sobre una superficie de piedra",
    eyebrow: "04 / COMERCIO EXPERIMENTAL",
    statement: "Una forma de sentir.",
    description:
      "Una vitrina digital para objetos sensoriales. Fotografía, ritmo y detalles sutiles construyen un recorrido íntimo alrededor del producto.",
    services: ["Arte digital", "E-commerce", "Frontend"],
    color: "#d6d8dc",
  },
];
