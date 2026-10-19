# Portafolio creativo + Tienda — versión actualizada

Este proyecto contiene dos páginas estáticas responsive, sin carrito ni pagos: `index.html` (portafolio) y `tienda.html` (catálogo de cinco productos). Incluye HTML, CSS, JavaScript, una pista instrumental Lo-Fi original de demostración y espacios para incorporar tus fotografías, logos e información.

## Cómo abrir

1. Descomprime la carpeta completa. **No** separes los archivos HTML, CSS y JS.
2. Abre `index.html` en Chrome/Edge. Desde la navegación entra en **Tienda**.
3. Para probarlo en un servidor local, ejecuta `python -m http.server 8000` desde la carpeta y abre `http://localhost:8000/`. Para publicar, sube todo a Netlify, Vercel o tu hosting.

**Importante:** incluye tipografías alojadas en Google Fonts, que requieren conexión a Internet. Sin conexión se usan fuentes alternativas. El archivo de audio incluido sí es local.

## Reemplazar fotografías y logos

Guarda tus imágenes `.png`, `.jpg` o `.webp` (preferentemente WebP) en `assets/`. En `images.js` asocia cada clave con su archivo: `pack1: "assets/packaging-sushi.webp"`. Si el campo está vacío aparece un placeholder editable.

- `hero1` a `hero3`: tres banners promocionales de portada, cada uno con mensaje de WhatsApp propio.
- `brand1` a `brand10`: logos de clientes. Se incluyen nombres de referencia Oxford, Canon, Entel y Rally Copec; `MARCA 05` a `MARCA 10` son nombres de ejemplo que debes reemplazar. Aconsejamos logos transparentes.
- `pack1` a `pack6`: seis espacios de packaging en dos grupos de mosaico.
- `menu1` a `menu4`: fotografías de los cuatro proyectos de carta.
- `illustrationMain`, `illustration1` a `illustration8`: visualizador y miniaturas.
- `social1` a `social10`: diseños de redes sociales.
- `interior`: fotografía grande de diseño interior.
- `review1` a `review9`: fotos de testimonios.
- `shop1` a `shop5`: cinco productos, de los cuales los tres primeros también aparecen destacados en el banner de la tienda y en el anuncio del portafolio.

Para cambiar los títulos/descripciones de ilustraciones y posts del modal, modifica `project-data.js`.

## WhatsApp y productos

En **`tienda-data.js`**, cambia `whatsapp: ""` por tu número, con código de país y solo dígitos, por ejemplo Chile `569XXXXXXXX` (reemplaza las X). Sin número válido, los enlaces a WhatsApp no pueden abrir una conversación dirigida a tu negocio.

En `products` de ese mismo archivo reemplaza nombres, categorías, precios y descripciones de los **cinco** artículos. Cada botón **ME INTERESA** genera un mensaje con el nombre del producto.

En **`site-settings.js`** edita los **tres mensajes promocionales de los banners de portada**. Se abrirán al pulsar cada banner. Los productos destacados del shop usan por defecto el nombre del producto 1–3 para su mensaje.

## Componentes interactivos

- Habilidades: cinco servicios con tres tarjetas visibles en escritorio, flechas y arrastre directo desde la tarjeta.
- Packaging: mosaico en loop automático, con arrastre y flechas, sin recortar las imágenes incluidas.
- Diseño de menú: cuatro cartas en un acordeón que avanza y retrocede con scroll. Las cuatro pestañas permanecen accesibles y permiten saltar a un proyecto.
- Ilustración: miniaturas en loop, visualizador mayor y ventana emergente con descripción.
- Redes sociales: fila superior hacia izquierda e inferior hacia derecha; ambas se detienen cuando se abre un post en modal.
- Testimonios: una sola fila en movimiento; el banner SHOP es una sección separada y más grande debajo.
- Índice lateral minimalista, enlaces a cada sección, WhatsApp fijo y footer azul de ancho completo con círculo **CARA CATO** en las dos páginas.
- Tienda: tres destacados rotativos, huincha del 10%, cinco tarjetas de igual tamaño en carrusel arrastrable, botones WhatsApp y pasos de compra.
- Música: reproductor Lo-Fi manual, volumen ajustable y pausa, arriba a la derecha en Tienda. Su pista es `assets/lofi-original.mp3`, **demostración original instrumental de 25,6 segundos en loop**, que puedes reemplazar por otra pista con permiso de uso. No se reproduce automáticamente.

## Archivos principales

`index.html`, `tienda.html`, `styles.css`, `final.css`, `tienda.css`, `updates.css`, `script.js`, `tienda.js`, `shop-updates.js`, `images.js`, `tienda-data.js`, `project-data.js`, `site-settings.js`, `floating.js`, `assets/`.

El archivo `updates.css` recoge los nuevos ajustes; es mejor editar ese archivo para cambios de proporciones sin alterar los estilos base. Verifica los textos, enlaces sociales, datos comerciales y derechos de uso de logos/imágenes antes de publicar.
