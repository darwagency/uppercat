(() => {
  'use strict';
  const config = window.SHOP_CONFIG || {};
  const products = Array.isArray(config.products) ? config.products.slice(0, 5) : [];
  const imageMap = window.SITE_IMAGES || {};

  function whatsappLink(product) {
    const name = product?.name || 'la tienda';
    const text = product
      ? `¡Hola! Vi el producto "${name}" en su tienda web. ¿Me pueden indicar el precio, la disponibilidad y cómo comprarlo?`
      : '¡Hola! Vi su tienda web y me gustaría hacer una consulta.';
    // Sin número, WhatsApp abre el flujo para compartir el mensaje.
    // Con número se inicia el chat con esa cuenta y el mensaje listo.
    const phone = String(config.whatsapp || '').replace(/[^0-9]/g, '');
    return `https://wa.me/${phone ? phone : ''}?text=${encodeURIComponent(text)}`;
  }

  function putImage(slot, key) {
    const file = imageMap[key];
    if (!file || typeof file !== 'string') return;
    const image = document.createElement('img');
    image.alt = slot.dataset.alt || '';
    image.src = file;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('load', () => slot.classList.add('has-image'));
    image.addEventListener('error', () => image.remove());
    slot.prepend(image);
  }

  const grid = document.getElementById('shop-products-grid');
  if (grid) {
    grid.replaceChildren();
    products.forEach((item, index) => {
      const n = String(index + 1).padStart(2, '0');
      const card = document.createElement('article');
      card.className = 'shop-product';

      const media = document.createElement('div');
      media.className = 'shop-image media-slot';
      media.dataset.alt = `Fotografía de ${item.name || `producto ${n}`}`;
      const preview = document.createElement('div');
      preview.className = 'shop-photo-placeholder';
      const kicker = document.createElement('span');
      kicker.className = 'shop-placeholder-kicker';
      kicker.textContent = 'TU FOTO AQUÍ ↗';
      const visual = document.createElement('span');
      visual.className = 'shop-placeholder-visual';
      const big = document.createElement('span');
      big.className = 'shop-placeholder-number';
      big.textContent = n;
      const bottom = document.createElement('div');
      bottom.className = 'shop-image-bottom';
      const b1 = document.createElement('span');
      b1.textContent = 'SHOP / TU MARCA';
      const b2 = document.createElement('span');
      b2.textContent = `FOTO ${n}`;
      bottom.append(b1, b2);
      preview.append(kicker, visual, big, bottom);
      media.append(preview);
      putImage(media, `shop${index + 1}`);

      const body = document.createElement('div');
      body.className = 'shop-card-body';
      const meta = document.createElement('div');
      meta.className = 'shop-card-meta';
      const category = document.createElement('span');
      category.textContent = item.category || `ARTÍCULO / ${n}`;
      const num = document.createElement('span');
      num.className = 'shop-card-index';
      num.textContent = n;
      meta.append(category, num);
      const title = document.createElement('h3');
      title.textContent = item.name || `Producto ${n}`;
      const desc = document.createElement('p');
      desc.textContent = item.description || 'Próximamente más información.';
      const action = document.createElement('div');
      action.className = 'shop-card-action';
      const price = document.createElement('span');
      price.className = 'shop-price';
      price.textContent = item.price || 'Consultar precio';
      const link = document.createElement('a');
      link.className = 'shop-buy';
      link.href = whatsappLink(item);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `Consultar por WhatsApp sobre ${item.name || `producto ${n}`}`);
      const label = document.createElement('span');
      label.textContent = 'ME INTERESA';
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      link.append(label, arrow);
      action.append(price, link);
      body.append(meta, title, desc, action);
      card.append(media, body);
      grid.append(card);
    });
  }

  // Cinco productos de igual tamaño en un carrusel horizontal verdaderamente infinito.
  const vp=document.getElementById('shop-products-grid');
  if(vp && vp.querySelectorAll('.shop-product').length) {
    const group=document.createElement('div');group.className='shop-loop-group';
    [...vp.children].forEach(child=>group.append(child));
    const track=document.createElement('div');track.className='shop-loop-track';track.append(group);
    const before=group.cloneNode(true),after=group.cloneNode(true);
    [before,after].forEach(copy=>{copy.setAttribute('aria-hidden','true');copy.querySelectorAll('a,button').forEach(el=>el.setAttribute('tabindex','-1'));});
    track.prepend(before);track.append(after);vp.append(track);
    let unit=0,drag=null,lastDragged=0;
    function measure(){const old=unit;unit=group.getBoundingClientRect().width;if(unit)vp.scrollLeft=unit+(old?(vp.scrollLeft-old)/old*unit:0);}
    measure();window.addEventListener('resize',()=>requestAnimationFrame(measure));
    vp.addEventListener('scroll',()=>{if(vp.scrollLeft<unit*.5){vp.scrollLeft+=unit;if(drag)drag.left+=unit;}else if(vp.scrollLeft>unit*1.5){vp.scrollLeft-=unit;if(drag)drag.left-=unit;}},{passive:true});
    vp.addEventListener('dragstart',e=>e.preventDefault());
    vp.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return;drag={id:e.pointerId,x:e.clientX,left:vp.scrollLeft,moved:false};});
    vp.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>6){drag.moved=true;vp.classList.add('is-dragging');try{vp.setPointerCapture(e.pointerId);}catch(_){}}if(drag.moved){vp.scrollLeft=drag.left-dx;if(e.cancelable)e.preventDefault();}});
    const endDrag=e=>{if(!drag||drag.id!==e.pointerId)return;if(drag.moved)lastDragged=performance.now();drag=null;vp.classList.remove('is-dragging');if(vp.hasPointerCapture(e.pointerId))vp.releasePointerCapture(e.pointerId);};
    vp.addEventListener('pointerup',endDrag);vp.addEventListener('pointercancel',endDrag);
    vp.addEventListener('click',e=>{if(performance.now()-lastDragged<400){e.preventDefault();e.stopImmediatePropagation();}},true);
    function shift(dir){const card=group.querySelector('.shop-product');vp.scrollBy({left:dir*(card.getBoundingClientRect().width+14),behavior:'smooth'});}
    document.querySelector('[data-product-prev]')?.addEventListener('click',()=>shift(-1));
    document.querySelector('[data-product-next]')?.addEventListener('click',()=>shift(1));
    vp.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();shift(e.key==='ArrowRight'?1:-1);}});
  }

  document.querySelectorAll('[data-image]').forEach((slot) => putImage(slot, slot.dataset.image));

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    const closeNav = () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú');
    };
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navLinks.classList.toggle('is-open', !expanded);
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navToggle.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeNav(); });
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
