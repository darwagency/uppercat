(() => {
  'use strict';
  const el = document.querySelector('[data-whatsapp-floating]');
  if (!el) return;
  // Configurar número real en tienda-data.js para abrir el chat de destino.
  const phone = String(window.SHOP_CONFIG?.whatsapp || '').replace(/\D/g,'');
  const message = '¡Hola! Estuve viendo su portafolio y me gustaría consultar por sus servicios de diseño.';
  el.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
})();
