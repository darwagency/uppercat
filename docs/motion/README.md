# Movimiento de Uppercat

Se mantiene la composición del HTML. Los cambios afectan al movimiento y a la respuesta de los controles.

| Elemento | Comportamiento |
| --- | --- |
| Índice derecho | Abanico en hover o foco: escala 1,035, expansión vertical por enlace de 1,6 px y giro máximo de 1°. Transición de 450 ms. Solo escritorio con mouse; en reposo conserva sus medidas. |
| Marcas | Desplazamiento visual a la derecha, 18 px/s. |
| Packaging | A la derecha, 16 px/s. |
| Ilustraciones | A la izquierda, 16 px/s. |
| Redes, fila superior | A la derecha, 18 px/s. |
| Redes, fila inferior | A la izquierda, 18 px/s. |
| Testimonios y productos | A la izquierda, 12 px/s para favorecer la lectura. |
| Portada y destacado | Fundido de 750 ms; rotación cada 6 s / 6,5 s. Las diapositivas inactivas usan `inert` y `aria-hidden`. |
| Cinta de la tienda | Loop CSS de 80 s con dos grupos idénticos y el espacio final incluido, para evitar el salto en la unión. |

Las galerías usan distancia fraccionaria acumulada para mantener el avance a velocidades inferiores a un píxel por frame. No se actualiza estado de React por frame. `IntersectionObserver` activa únicamente lo que está en pantalla; las galerías detenidas cancelan su `requestAnimationFrame` y las portadas su temporizador.

Hover, foco de teclado, presión/arrastre, rueda, un proyecto abierto, una pestaña oculta y `prefers-reduced-motion` detienen el movimiento. Al terminar un arrastre o una interacción manual se esperan 2,4 s; al salir del foco, 1,2 s. Las flechas, los enlaces y el swipe siguen funcionando. La pausa explícita de teclado se conserva hasta que el usuario la reactive.

No se incorporan dependencias. La configuración está en `components/Rail.tsx`, la política de reproducción en `components/useAmbientMotion.ts` y los efectos de presentación en `app/globals.css`.

## Revisión de navegador

Mediciones en `browser-checks.json`: redes avanzan -221 / +221 px de scroll en 12,273 s; con hover la fila superior permanece quieta mientras la inferior continúa. Las dos filas permanecen quietas con un modal abierto y con movimiento reducido. La pausa explícita del catálogo se conserva al salir del foco. Se revisaron el teclado, el arrastre con mouse, la cinta, el índice móvil y la ausencia de copias tabulables. La revisión móvil usa un viewport emulado de 390×680; no sustituye una prueba física de gestos táctiles.

Capturas: `index-fan-desktop.png` muestra el abanico activo a 1440×900; `mobile-social.png` muestra el índice desplegado en móvil. Las fotos siguen siendo los espacios de reserva del HTML, pendientes del diseñador.
