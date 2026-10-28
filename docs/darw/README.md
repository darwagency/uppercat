# Darw — Principal 2

Reconstrucción del 25 de octubre de 2026. Ruta pública: https://uppercat.darwagency.workers.dev/principal-2

## Referencia visual

La referencia es la página principal de Uppercat de este repositorio. De ella se toman la navegación en cápsula, la portada como pieza gráfica, las tarjetas visuales de áreas, la tipografía condensada, los bloques de color, el mosaico de packaging, el acordeón de proyectos, el bloque de ilustración y la densidad de imágenes de redes sociales.

La web de Darw aporta la marca, los proyectos y las imágenes reales. Su composición no se usa como plantilla. Se eliminó la propuesta anterior: encabezado editorial, grilla general de proyectos, explorador de servicios, bloque de proceso y formulario de contacto.

## Nuevo recorrido

1. Portada gráfica con tres proyectos y controles visibles de reproducción.
2. Marcas y tarjetas ilustradas de áreas, con desplazamiento horizontal en móvil.
3. Redes sociales: ocho piezas en carruseles pasivos, filtrables por marca.
4. Identidad: tres marcas, cada una con un tablero de aplicaciones, logotipo y sistema visual.
5. Packaging: mosaico horizontal de cajas, bolsas y aplicaciones; flechas, teclado y desplazamiento táctil nativo.
6. Web y ecommerce: cinco proyectos en un acordeón, con vistas dentro de un marco de navegador.
7. Ilustración: composición tipográfica y personaje seleccionable.
8. Contacto directo por WhatsApp, email e Instagram.

Las explicaciones visibles se limitan a títulos de disciplina, nombres de marca y tipos de pieza. No se incluyen métricas, testimonios ni servicios sin respaldo en los proyectos disponibles.

## Implementación

- `app/principal-2/page.tsx`: composición de secciones y metadata.
- `app/principal-2/portfolio.module.css`: nuevo sistema visual y adaptación móvil, aislado del resto del sitio.
- `components/darw/DarwPortfolio.tsx`: nuevos componentes de navegación, portada, galerías, acordeón, filtros y visor.
- `data/darw.ts`: ocho proyectos, imágenes y destinos de contacto.
- `components/useAmbientMotion.ts`: comportamiento de movimiento compartido con Uppercat. La portada se pausa por interacción, diálogo abierto, pestaña oculta y preferencia de movimiento reducido.

El visor usa un diálogo nativo, navega con flechas y miniaturas, se cierra con Escape y devuelve el foco al disparador. Las miniaturas y enlaces al caso original permiten explorar sin poner párrafos en la portada. El contacto abre el canal seleccionado, sin enviar mensajes automáticamente.

## Medios

Se reutilizan únicamente los recursos de proyectos publicados por Darw, optimizados como WebP locales. `asset-sources.json` conserva su procedencia. `scripts/import-darw-assets.mjs` permite reimportarlos. No se generaron trabajos de clientes ficticios.

## Verificación

Compilación estática y seis pruebas de exportación aprobadas. Se comprobaron selección de identidad, apertura en la imagen correspondiente, navegación del visor, Escape y restauración del foco; acordeón web, personajes, filtros de redes, galería de packaging y enlaces de contacto. Se revisaron 320, 390, 768 y 1440 px sin desbordamiento horizontal del documento. Las galerías con desplazamiento conservan su overflow local intencional. La revisión móvil es emulada.

Capturas: `desktop.jpg`, `mobile.jpg` e `illustration.jpg`.

## Marquee de clientes · 28 de octubre de 2026

Se incorporan los 14 logos preparados y nombrados por el usuario. `data/darw-logos.json` registra fuentes, recorte del contenido, dimensiones y peso; `scripts/prepare-darw-logos.mjs` genera las variantes desde la entrega local. Los másteres no se envían al navegador. Se sirven WebP sin pérdida con alpha, a 1x y 2x mediante srcSet: 159036 y 364206 bytes por conjunto respectivamente.

Los márgenes transparentes se normalizan sin cortar símbolos o letras. Los logos conservan proporción y color. Torii y Fusion usan las variantes oscuras para fondo claro, recuperando la máscara alpha del máster original. RC/RacingCars, Pizzarella y Outlet se presentan a escala contenida por su resolución de origen. Los microtextos forman parte del logo y su lectura no se garantiza a tamaño reducido.

El marquee reutiliza el Rail de Uppercat: bucle continuo, arrastre, teclado, pausa por foco/hover y respeto de movimiento reducido. No muestra un control de pausa. Las copias están ocultas del árbol de accesibilidad. Las pruebas comprueban exportación de las 14 marcas, transparencia de bordes y ausencia de rectángulos opacos en las variantes de contraste. Capturas de integración: `marquee-desktop.jpg` y `marquee-mobile.jpg`.

## Redes y movimiento

Redes Sociales aparece inmediatamente después de Áreas, con el índice y el enlace Trabajo siguiendo ese orden. La selección general muestra dos carruseles horizontales de ocho piezas repartidas en filas con direcciones opuestas. El filtro Ruralpoke usa una fila, mientras que las selecciones de una o dos piezas quedan estáticas. Cada fila animada admite arrastre, teclado y pausa visible; se detiene por hover, foco, diálogo abierto, pestaña oculta y preferencia de movimiento reducido.

PortfolioMotion añade entradas progresivas a títulos, categorías, tableros y bloques de contacto. Los detalles de portada flotan, los asteriscos y órbitas giran, el fondo de ilustración oscila y los controles responden al hover y a la pulsación. Los efectos decorativos solo corren cerca del viewport y se pausan al abrir el visor. Las transiciones usan opacidad y transformaciones; no se captura el scroll ni se anima la geometría del documento. El contenido sigue visible si JavaScript no está disponible.

Verificado en escritorio y móvil de 390 px sin desbordamiento. Los carruseles cambian su desplazamiento al estar visibles, la pausa manual funciona, el visor abre la campaña elegida y pausa los efectos, el filtro Fusion muestra una única pieza estática. Con movimiento reducido se mantuvieron las posiciones de ambas filas y no quedaron entradas ocultas. Ocho pruebas de exportación aprobadas. Capturas: `social-motion-desktop.jpg` y `social-motion-mobile.jpg`.

## Ajuste de suavidad y espacio

Los logos se muestran a 184 px en escritorio y 156 px en móvil dentro de celdas más separadas (48 y 38 px de gap). El marquee avanza a 12 px/s y las filas sociales a 14 px/s. Las tres filas conservan el desplazamiento fraccional con una compensación de transform en el compositor y aceleran/frenan gradualmente al interactuar. Las preferencias de movimiento reducido y la pestaña oculta detienen inmediatamente la animación. Las transiciones de hover y entrada se alargan, con desplazamientos menores y oscilaciones decorativas más lentas. Estos ajustes están limitados a Principal 2.

Comprobado a 1440 y 390 px: sin desbordamiento del documento, tamaños y gaps correctos, control de pausa de logos ausente y compensación fraccional inferior a medio píxel. Ambas filas sociales avanzan en sentidos opuestos y permanecen inmóviles con movimiento reducido, sin contenido oculto ni errores de consola. Las transiciones de entrada conservan también la transición de hover de las tarjetas. Capturas: `smooth-marquee-desktop.jpg` y `smooth-marquee-mobile.jpg`.
