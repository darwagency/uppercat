# Darw — Principal 2

Propuesta local en `/principal-2`, construida el 25 de octubre de 2026.

## Lectura de la referencia

La portada de Uppercat organiza el contenido por disciplinas: portadas, marcas, habilidades, packaging, menú, ilustración, redes, interior, testimonios y tienda. Su mayor fortaleza es dar espacio al trabajo y permitir reconocer cada área con una mirada. Las galerías horizontales, el cambio entre fondos y las imágenes grandes crean ritmo sin exigir largos textos.

La nueva página conserva esa densidad visual y la exploración por secciones. Replantea el recorrido para una agencia que reúne estrategia, identidad, desarrollo web, ecommerce y campañas. Los espacios de ejemplo de Uppercat se reemplazan por material publicado en darw.cl. No se agregan métricas, resultados ni testimonios inventados.

## Dirección de diseño

- Base cálida y neutra, contraste con bloques oscuros y acento lima para acciones y estados.
- Tipografía sans con escala editorial y serif cursiva para dar contraste a titulares breves.
- Grilla asimétrica de proyectos que alterna proporciones 7/5 y 5/7.
- Cada área tiene un formato propio: portada con selección, archivo filtrable, explorador de servicios, tira de campañas, proceso y contacto.
- Movimiento orientado a explorar: transiciones de portada, respuestas al cursor, cambio de imágenes y desplazamiento horizontal nativo. Sin secuestrar el scroll de la página.
- Revisión de contenido: títulos descriptivos (Proyectos, Servicios, Campañas & redes), portada compacta y eliminación de eslóganes y párrafos repetidos. Los servicios se explican con etiquetas y ejemplos visuales; el detalle de los proyectos aparece al abrirlos. El texto visible del contenido principal pasó de 463 a 246 palabras en la vista revisada.

## Componentes e interacción

- **Portada:** tres destacados, selección manual y pausa. La rotación se detiene por foco, hover, pestaña oculta, fuera de pantalla, visor abierto y movimiento reducido.
- **Archivo:** ocho proyectos, cinco filtros, vista de cuadrícula/lista y expansión de la selección.
- **Visor:** diálogo nativo con miniaturas, anterior/siguiente, flechas del teclado, Escape y restauración del foco. Enlace al caso original.
- **Servicios:** acordeón con ejemplo visual que cambia y abre el proyecto relacionado.
- **Campañas:** fila horizontal con swipe, teclado y flechas; cada pieza abre su posición en el proyecto.
- **Contacto:** selección de intereses y contexto opcional para preparar un enlace de WhatsApp o email. No envía mensajes automáticamente.
- **Navegación:** cabecera sticky, sección activa, progreso de lectura y menú móvil.

## Edición del contenido

`data/darw.ts` contiene los proyectos, categorías, medios, servicios y datos de contacto. Para ampliar el archivo, agregar un proyecto con ID único, portada, categorías e imágenes con descripción. Los filtros y el visor se construyen a partir de esos datos.

`components/darw/DarwExperience.tsx` contiene las interacciones. `app/principal-2/page.tsx` define la composición y metadata. `app/principal-2/darw.module.css` mantiene los estilos aislados. `SiteFrame` selecciona la cabecera y el pie de Uppercat para las otras rutas.

## Imágenes y procedencia

Imágenes descargadas de las páginas públicas de Darw y optimizadas como WebP locales. `asset-sources.json` registra cada archivo y su URL original. `scripts/import-darw-assets.mjs` permite recuperar recursos faltantes y conserva los ya descargados. Los medios incluidos son los publicados por Darw; no se generaron nuevos trabajos de clientes para esta propuesta.

Fuentes consultadas:
- https://darw.cl/
- https://darw.cl/portfolio
- https://darw.cl/gastronomia/rural-burger
- https://darw.cl/gastronomia/ruralpoke
- https://darw.cl/gastronomia/fusion-sushi-quillota
- https://uppercat.darwagency.workers.dev/

## Verificación

Recorrido comprobado: portada → filtro → proyecto → imágenes → cerrar → servicios → campañas → mensaje de contacto. Se revisaron Escape, flechas de teclado, foco, menú móvil y enlaces de contacto sin enviar mensajes.

La subpágina usa sus propios metadata, favicon y contacto de Darw. La portada y tienda de Uppercat conservan su contenido, estilos y contacto. Las pruebas de exportación verifican esta separación y que los recursos locales y las anclas existan.

Capturas: `desktop.jpg` y `mobile.jpg`. La revisión móvil es emulada; no sustituye una prueba física de gestos táctiles.

Ruta pública de la propuesta: https://uppercat.darwagency.workers.dev/principal-2

Resultado final: compilación estática de Next.js 16.3.8 correcta y 6/6 pruebas aprobadas. Revisión en 320, 390, 768, 1440 y 1920 px sin desbordamiento horizontal de página. Se corrigió el tamaño intrínseco del bloque gráfico del estudio en móvil. El carrusel permaneció en la misma diapositiva durante 42 segundos con movimiento reducido y sin pausa manual. Consola del navegador sin errores ni advertencias en el recorrido revisado.
