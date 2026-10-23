# Validación de Uppercat

Fecha de revisión: 23 de octubre de 2026. Fidelidad al HTML original y animaciones de la web.

El recorrido principal es inicio → selección de servicio/proyecto → consulta dirigida a WhatsApp, o inicio → tienda → producto → enlace de consulta con su nombre. Es una exportación estática: los flujos actuales no requieren API, base de datos ni variables secretas.

## Comprobaciones

- Compilación de producción con Next.js 16.3.8 y TypeScript estricto.
- Cuatro pruebas automáticas: destinatario y codificación de WhatsApp; contenido prerenderizado y catálogo; anclas y archivos locales; conservación de la estructura y ausencia de navegación añadida. Incluyen el payload de navegación de `/tienda` que fallaba en Windows.
- Navegador sobre los archivos exportados servidos por Wrangler: navegación inicio/tienda, carrusel de portada, selección de cuatro cartas, selección y ampliación de ilustración, ampliación de redes sociales, cierre con Escape y restauración de foco.
- Menú móvil: abre, permite navegar y se cierra tras elegir un enlace.
- Audio: reproduce por acción manual, pausa y silencia. El archivo local responde correctamente.
- Galería de servicios: flecha de teclado desplaza la fila. Movimiento reducido inicia la portada en pausa.
- Revisados 320, 390, 768 y 1440 px. Las galerías mantienen su propio scroll. A 320 px el navegador registra 1 px de redondeo horizontal, sin desborde visible; a 768 px el ancho del documento coincide con el área disponible.
- Comparación directa con el HTML servido por separado, en 1440×900 y 390×844. Las 18 mediciones de ancho, alto y posición vertical del inicio en escritorio coinciden. En móvil las diferencias de tipografía acumulan hasta 2 px en inicio y 3 px en tienda; no hay diferencias de ancho. Tienda en escritorio presenta hasta 1 px de diferencia vertical.
- Capturas del original y de la réplica y mediciones JSON en `docs/design-reference/`. La portada vuelve a ser un banner 2.35:1 sin titulares añadidos; se restauran los loops, el mazo sticky, el índice sin caja y el footer compacto.
- Última sesión de navegador sin advertencias o errores de consola. Los logs de Wrangler confirman HTTP 200 para `/tienda/__next.tienda.__PAGE__.txt` después de la corrección.
- Página inexistente muestra la página 404 personalizada.
- Animaciones comprobadas en navegador con la exportación final: filas sociales a ±18 px/s, pausa independiente al pasar el cursor, galerías fuera de pantalla detenidas y fondo detenido al abrir un proyecto. En 12,85 s con movimiento reducido ambas filas permanecieron en la misma posición. El arrastre desplaza 180 px sin abrir un modal por accidente.
- Catálogo a 12 px/s; pausa explícita permanece tras salir del foco (44,9 s sin desplazamiento). El teclado alcanza el quinto producto sin que la normalización lo envíe a una copia fuera de vista. El control de pausa aparece fijo al enfocarlo. La cinta se pausa al pasar el cursor y mantiene su transformación durante 21,4 s.
- Índice de escritorio: expansión en abanico y retorno a sus medidas de reposo. A 390×680 el menú abre y navega a tienda, no usa el efecto de escritorio y el documento mide 390 px de ancho. Cero enlaces o botones de copias en el orden de tabulación. Sin errores ni advertencias de consola en la revisión final. Evidencia y mediciones en `docs/motion/`.
- PDF V3: 19 páginas, las 60 claves presentes y una nueva página con velocidades, direcciones y estados de movimiento. Páginas actualizadas renderizadas con Poppler y revisadas visualmente.

## Contenido pendiente

No llegaron fotografías, logos, fichas finales, testimonios, URLs sociales ni datos comerciales de los cinco productos. Se conservan los espacios de referencia del modelo: marcas genéricas, nueve textos de reserva y cinco fichas de producto de ejemplo. No se atribuyen marcas o reseñas a clientes no confirmados. El brief detalla cada entrega.

Las pruebas verifican la generación de enlaces; no envían mensajes ni crean pedidos. El push a `main` entrega el código al repositorio. No constituye por sí solo una confirmación de despliegue público.
