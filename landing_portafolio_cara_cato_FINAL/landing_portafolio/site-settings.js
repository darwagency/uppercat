/* Enlaces promocionales editables + imágenes de marcas.
   Indica el número de WhatsApp en tienda-data.js (569... para Chile).
   Cambia el texto de cada promoción aquí. */
(() => {
 const phone=String(window.SHOP_CONFIG?.whatsapp || '').replace(/\D/g,'');
 const wa=text=>`https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
 const promos=[
  '¡Hola! Me interesa la promoción del banner 01 de su portafolio.',
  '¡Hola! Me interesa la promoción del banner 02 de su portafolio.',
  '¡Hola! Me interesa la promoción del banner 03 de su portafolio.'
 ];
 document.querySelectorAll('[data-promo]').forEach(a=>{a.href=wa(promos[Number(a.dataset.promo)]||promos[0]);});
 document.querySelectorAll('[data-brand-image]').forEach(img=>{
   const filename=(window.SITE_IMAGES||{})[img.dataset.brandImage];
   if(filename){img.src=filename;img.hidden=false;img.onerror=()=>{img.hidden=true;};}
 });
 const ix=document.querySelector('.side-index');
 if(ix){
  function update(){
   const target=document.elementFromPoint(Math.max(0,innerWidth-180),innerHeight*.5);
   const bg=target?.closest('.skills-section,.brands-section,.shop-catalog');
   ix.classList.toggle('light-index',!!bg);
  }
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
 }
})();
