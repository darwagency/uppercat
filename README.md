# Uppercat

Portafolio y catálogo del artista **Uppercat**, migrados desde `landing_portafolio_cara_cato_FINAL/landing_portafolio` a Next.js 16.3.8, React 19 y TypeScript. Exportación estática para el hosting Cloudflare Workers existente.

## Desarrollo y validación

Requiere Node.js 22.18+ o 24 (las pruebas usan soporte nativo de TypeScript).

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm test
npm start
```

`npm start` sirve `out/` mediante Wrangler. Ejecutar el build antes. `/` es el portafolio; `/tienda` es el catálogo. El hosting resuelve el HTML exportado y conserva una página 404 real. No se necesita servidor de Next, base de datos ni credenciales para los flujos implementados.

El build agrega alias de URL para los payloads de segmentos que Next 16.3.8 exporta con separadores de Windows. Esto corrige los 404 de prefetch al entrar a `/tienda` sin modificar `node_modules`; en plataformas que ya los exportan correctamente no agrega nada.

## Contenido

- `data/site.ts`: identidad, contacto, promociones, servicios, fichas, productos, marcas y reseñas.
- `data/images.json`: los 60 espacios de imagen del documento del diseñador. Guardar archivos en `public/images/` y asignar rutas absolutas desde la web, por ejemplo `"pack1": "/images/pack1.webp"`.
- `public/audio/lofi-original.mp3`: pista de demostración suministrada en la carpeta original. Reproducción manual, sin autoplay.
- `public/fonts/`: Anton y DM Sans, servidas con `next/font/local` y sus licencias OFL. La web no depende de Google Fonts en tiempo de navegación.
- `output/pdf/Uppercat-brief-diseno-web.pdf`: brief para diseño, inventario y especificaciones de entrega.

WhatsApp: **+56 9 3345 7166**. Correo: **uppercat@gmail.com**. Las consultas incorporan el nombre del producto o el mensaje de la promoción. El sitio no procesa pagos.

Las fotos, logos, proyectos, reseñas y productos definitivos no fueron entregados. Se conservan los espacios del HTML: diez marcas genéricas, nueve tarjetas de testimonio con textos explícitos de reserva y cinco productos en preparación. No se atribuyen clientes ni testimonios reales sin confirmación. Los perfiles sociales pendientes se muestran como referencias sin enlace y no se publica el descuento no confirmado del original.

La carpeta HTML es la referencia visual exacta. `app/globals.css` importa sus cuatro hojas en el orden original; los componentes React conservan sus clases y geometría. No añadir barras de navegación, titulares de portada, pies de tarjetas ni secciones que no existan en el modelo. La portada es un banner de imagen 2.35:1 en escritorio y móvil, sin textos editoriales HTML superpuestos.

## Interacciones

Carruseles con los controles visibles del modelo. La pausa adicional solo aparece al recibir foco de teclado. Las galerías mantienen loops continuos, arrastre con mouse, swipe nativo y flechas de teclado. Las copias se ocultan del árbol accesible y del orden de tabulación. El mazo de cuatro menús recupera su tramo de scroll sticky y selección directa. Los modales usan `dialog`, restauran el foco y cierran con Escape o fuera del contenido. El modo de movimiento reducido evita autoplay y scroll suave, conservando las proporciones del modelo.

## Entrega de diseño

Consultar el PDF y su generador editable en `scripts/generate_design_brief.py`. El generador usa Python con ReportLab, Pillow y pypdf. Ejecutar desde la raíz:

```sh
python scripts/generate_design_brief.py
```

El original HTML queda conservado como referencia. El despliegue mantiene `output: "export"` y `wrangler.jsonc`; el push a `main` actualiza el código del repositorio. Si el repositorio está conectado a un servicio de despliegue, ese servicio deberá completar su propio build.
