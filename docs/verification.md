# Validación de Uppercat

Fecha de revisión: 18 de octubre de 2026.

El recorrido principal es inicio → selección de servicio/proyecto → consulta dirigida a WhatsApp, o inicio → tienda → producto → enlace de consulta con su nombre. Es una exportación estática: los flujos actuales no requieren API, base de datos ni variables secretas.

## Comprobaciones

- Compilación de producción con Next.js 16.3.8 y TypeScript estricto.
- Tres pruebas automáticas: destinatario y codificación de WhatsApp; contenido prerenderizado y catálogo; anclas y archivos locales. Incluyen el payload de navegación de `/tienda` que fallaba en Windows.
- Navegador sobre los archivos exportados servidos por Wrangler: navegación inicio/tienda, carrusel de portada, selección de cuatro cartas, selección y ampliación de ilustración, ampliación de redes sociales, cierre con Escape y restauración de foco.
- Menú móvil: abre, permite navegar y se cierra tras elegir un enlace.
- Audio: reproduce por acción manual, pausa y silencia. El archivo local responde correctamente.
- Galería de servicios: flecha de teclado desplaza la fila. Movimiento reducido inicia la portada en pausa.
- Sin desbordes horizontales de página en 320, 390, 768 y 1440 px. Las galerías mantienen su propio scroll.
- Última sesión de navegador sin advertencias o errores de consola. Los logs de Wrangler confirman HTTP 200 para `/tienda/__next.tienda.__PAGE__.txt` después de la corrección.
- Página inexistente muestra la página 404 personalizada.
- PDF: 18 páginas, las 60 claves presentes, sin caracteres de reemplazo ni texto fuera de página. Páginas renderizadas con Poppler y revisadas visualmente.

## Contenido pendiente

No llegaron fotografías, logos, fichas finales, testimonios, URLs sociales ni datos comerciales de los cinco productos. Las reservas están rotuladas y los artículos se presentan como una colección en preparación. Marcas y reseñas se habilitan únicamente al cargar datos reales. El brief detalla cada entrega.

Las pruebas verifican la generación de enlaces; no envían mensajes ni crean pedidos. El push a `main` entrega el código al repositorio. No constituye por sí solo una confirmación de despliegue público.
