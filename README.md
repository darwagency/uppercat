# Portafolio creativo en Next.js

Estudio visual inspirado en [segerman.dev](https://segerman.dev/): tipografía monumental, galería editorial que revela color con el cursor, índice que sigue el scroll, movimiento sutil y navegación mínima. El contenido, las imágenes y la identidad de esta versión son originales y sirven como base editable.

## Ejecutar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Para verificar la compilación: `npm run build`.

## Desplegar en Cloudflare Workers

Este sitio se exporta como archivos estáticos en `out/`. En el proyecto de Cloudflare conectado a este repositorio, usa `npm run build` como comando de compilación y `npx wrangler deploy` como comando de despliegue. `wrangler.jsonc` publica `out/` en el Worker `uppercat`.

Para probar localmente la versión de Cloudflare, ejecuta `npm run build` y luego `npm start`.

## Personalizar

- Nombre, correo y navegación: `components/SiteChrome.tsx`
- Titular, descripción e interacciones de la portada: `components/HomeExperience.tsx`
- Proyectos, textos y colores: `data/projects.ts`
- Biografía: `app/info/page.tsx`
- Estilos, animaciones y puntos de quiebre: `app/globals.css`
- Metadatos: `app/layout.tsx`
- Imágenes: `public/images/`

**Importante:** `hola@alexrivera.studio`, proyectos y servicios son datos de ejemplo. Reemplázalos antes de publicar.

## Imágenes originales

Se generaron con la herramienta integrada de imágenes y se guardaron dentro del proyecto:

| Archivo | Prompt final |
| --- | --- |
| `public/images/luma-studio.png` | Editorial candid photograph of two creative professionals collaborating around a laptop in a sunlit design studio, one foreground hand pointing to a screen, plants and materials in the background. High contrast black and white film photography, subtle grain, real imperfect texture, natural daylight. Dynamic asymmetric framing, artistic but credible. No logos or text. |
| `public/images/mesa.png` | Overhead editorial photograph of several refined dishes and bowls arranged on a white table, hands partly entering frame, lunch gathering, organic ceramics. High contrast black and white film photography, subtle grain, tactile shadows, art directed geometry. No logos or text. |
| `public/images/habitar.png` | Editorial portrait of two independent architects standing outside a modern concrete building among trees, full body, natural candid mood, architectural lines. High contrast black and white film photography, subtle grain, realistic details and deep shadows. No logos or text. |
| `public/images/objeto.png` | Premium sculptural glass perfume bottle and folded paper packaging on a dark stone plinth, dramatic directional studio light, refined contemporary art direction, strong graphic silhouette. High contrast black and white film photography, subtle grain. No logos or text. |
| `public/images/galaxy-trail.webp` | Imagen de galaxia utilizada por la versión anterior de la estela del cursor; se conserva como recurso disponible, pero el efecto actual no la carga. |

Las variantes a color se crearon con **edición de imagen** sobre cada fotografía original, conservando el encuadre y los elementos. Están en `public/images/luma-studio-color.png`, `mesa-color.png`, `habitar-color.png` y `objeto-color.png`. Indicaciones de edición: recuperar colores naturales y creíbles; luz cálida y vegetación verde para Luma Studio; tonos de comida, cerámica y mesa para Mesa; materiales arquitectónicos y árboles para Habitar; color de vidrio, papel y piedra con luz de estudio para Objeto. La portada usa cada variante a color tanto para la base en escala de grises como para la capa revelada, de modo que ambas coinciden píxel a píxel.

Para las páginas de proyecto se generó una segunda toma por caso con la herramienta integrada en modo **edición**, tomando la fotografía a color correspondiente como referencia:

| Archivo final | Indicación de edición |
| --- | --- |
| `public/images/luma-detail.png` | Vista editorial más cercana del mismo estudio: manos ordenando muestras impresas, materiales táctiles y borde del portátil, con plantas y luz cálida de fondo; fotografía realista sin texto ni logos. |
| `public/images/mesa-detail.png` | Acercamiento de dos platos de temporada en cerámica artesanal, una mano, lino y una copa; luz natural, verdes oliva y comida realista, sin texto ni logos. |
| `public/images/habitar-detail.png` | Encuadre alternativo del edificio de hormigón claro, ventanal, escaleras y árboles; los arquitectos aparecen pequeños, con luz y materiales naturales, sin texto ni logos. |
| `public/images/objeto-detail.png` | Primer plano del mismo frasco de vidrio ámbar y empaque de papel marfil sobre piedra oscura; refracciones y luz cálida de estudio, sin texto ni logos. |

## Interacciones

- Intro animada al entrar por primera vez en la sesión.
- Aparición progresiva de proyectos. Al recorrer una imagen con el ratón, una estela suave revela su color y luego se desvanece. Implementación: `components/FluidRevealImage.tsx`.
- La galería se estira y ondula brevemente según la velocidad del scroll; vuelve a quedar nítida al detenerse. Implementación y ajustes de intensidad: `components/GalleryScrollMotion.tsx`. Se desactiva con movimiento reducido y en pantallas pequeñas.
- Índice de proyectos activo según la posición del scroll.
- Páginas de proyecto a todo color con carrusel horizontal de cuatro piezas. La rueda vertical, el arrastre, las flechas del teclado y el gesto táctil desplazan la galería; durante el movimiento, las piezas se estiran y ondulan. Implementación: `components/ProjectCarousel.tsx`. La ficha inferior enlaza al proyecto siguiente.
- Cambio de tema claro/oscuro persistente.
- Botón para copiar el correo y alternativa `mailto:`.
- Estela líquida de cursor: el movimiento desplaza una película ligera de agua en forma de V. Sus bordes ondulan, se abren detrás del ratón según la velocidad y se disipan al detenerse. Sobre las imágenes de portada no se genera la estela para dar protagonismo al revelado de color. Se desactiva en pantallas táctiles y con movimiento reducido. Ajustes principales: `components/FluidCursor.tsx` (`WAKE_DURATION`, `MAX_WAKE_POINTS` y la amplitud de las bandas).
- Diseño adaptado a móvil y soporte de `prefers-reduced-motion`.
