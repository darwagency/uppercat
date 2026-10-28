# Revisión móvil de Principal 2

Revisión de la página pública y de la versión corregida, de portada a contacto. 28 de octubre de 2026.

## Dictamen

La identidad visual mantiene una sensación premium en móvil: títulos con carácter, contraste fuerte, proyectos grandes y composiciones distintas para cada disciplina. La experiencia necesitaba mejorar la comodidad de los controles y la orientación durante un recorrido de varias pantallas. Se corrigieron esos puntos sin cambiar la dirección visual.

## Hallazgos y ajustes

| Zona | Revisión y resultado |
| --- | --- |
| Cabecera | El menú quedaba atrás al bajar. Ahora la cápsula permanece accesible en móvil, incluye cada disciplina e indica la sección actual. El panel cabe en pantallas pequeñas y admite scroll en ventanas bajas. Escape, cierre al seleccionar y apertura/cierre funcionan. |
| Portada | Composición legible a 320 px, sin superposición entre título, disciplina y enlace. Flechas, pausa, menú y llamada de contacto tienen superficies de 44 px. Se conserva la imagen protagonista. |
| Logos | Mantienen tamaño contenido, separación y transparencia. El corte de una marca en el borde corresponde al bucle horizontal; los archivos no están recortados. Sin control de pausa, como pidió el usuario. |
| Categorías | La siguiente tarjeta asoma como señal de continuidad. Se añade «Desliza para explorar». El desplazamiento horizontal llega a las otras categorías sin mover horizontalmente el documento. |
| Redes | Filtros legibles y de 44 px; a 320 px se ordenan en dos columnas. Se verificó el filtro Fusion con una sola pieza y su apertura en el visor. Las campañas son vistas previas: el visor permite ver completa cada pieza, incluidas las historias verticales. |
| Identidad | El tercer selector quedaba parcialmente fuera. Las tres marcas caben ahora en una fila, incluso a 320 px. El cambio de marca funciona. Los dos cuadros pequeños conservan los logos completos con object-fit: contain. |
| Packaging | Flechas de 44 px y avance funcional. Las fotografías usan recortes editoriales como vista previa; al abrirlas se ve la imagen completa. |
| Web | Títulos sin cortes en los cinco anchos comprobados. Acordeón funcional: se probó abrir Fuego de Patio y cerrar el proyecto anterior. La imagen se puede ampliar. |
| Ilustración | Título y selectores caben en teléfono pequeño. Cambio de personaje funcional. Se elimina el ocultamiento inicial del bloque completo. |
| Contacto | WhatsApp, correo e Instagram conservan sus destinos. Enlaces más legibles y con altura táctil suficiente. El contacto sigue disponible desde la cabecera. No se enviaron mensajes. |
| Visor | Imagen completa con contain, cierre accesible, flechas de 44 px, miniaturas y textos más legibles. Sin desbordamiento horizontal del diálogo. Navegación de imagen y cierre comprobados. |
| Movimiento | Se mantienen los efectos suaves en títulos y detalles. Tableros, acordeón, ilustraciones y cuerpo del contacto ya no desaparecen detrás de un fundido de entrada al recorrer rápido la página. Las preferencias de movimiento reducido siguen deteniendo los efectos. |

## Validación

- Pantallas emuladas: 320×568, 375×812, 390×844, 430×932 y 844×390.
- Sin desbordamiento horizontal del documento, títulos principales cortados ni texto desbordado en los selectores de identidad en esos tamaños.
- Anclas comprobadas por clic y teclado. Se corrigió una interrupción del desplazamiento al ocultar el enlace enfocado del menú.
- Recorrido visual completo: portada, marcas, categorías, redes, identidad, packaging, web, ilustración y contacto.
- Compilación estática y ocho pruebas de exportación aprobadas.

Capturas: `identity-390.jpg`, `viewer-390.jpg`, `contact-390.jpg` y `menu-320.jpg`.

Esta revisión usa el navegador con tamaños emulados. La navegación horizontal se verificó con desplazamiento de navegador; la herramienta disponible no admite inyectar gestos táctiles nativos. No equivale a una medición de rendimiento o una prueba de Safari/iOS en un teléfono físico.
