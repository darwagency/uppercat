/* Música local Lo-Fi y 3 productos destacados con mensajes individuales. */
(()=>{
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const products=(window.SHOP_CONFIG?.products||[]);
 const phone=String(window.SHOP_CONFIG?.whatsapp||'').replace(/\D/g,'');
 const linkFor=(item)=>`https://wa.me/${phone}?text=${encodeURIComponent('¡Hola! Me interesa el producto destacado '+(item?.name||'de la tienda')+'. Quisiera más información.')}`;
 const slides=[...document.querySelectorAll('.shop-featured-slide')];
 const dots=[...document.querySelectorAll('[data-featured-dot]')];
 slides.forEach((slide,i)=>{
   slide.href=linkFor(products[i]);
   const image=slide.querySelector('img');
   const url=(window.SITE_IMAGES||{})[image.dataset.featuredImage];
   if(url){image.src=url;image.hidden=false;image.onerror=()=>{image.hidden=true;};}
 });
 let active=0,timer;
 const container=document.querySelector('.shop-featured');
 function show(i){active=(i+slides.length)%slides.length;slides.forEach((el,k)=>{el.classList.toggle('is-active',k===active);el.tabIndex=k===active?0:-1;});dots.forEach((el,k)=>el.classList.toggle('is-active',k===active));}
 function stop(){clearInterval(timer);}
 function start(){stop();if(!reduce&&!document.hidden)timer=setInterval(()=>show(active+1),3200);}
 document.querySelector('[data-featured-prev]')?.addEventListener('click',()=>{show(active-1);start();});
 document.querySelector('[data-featured-next]')?.addEventListener('click',()=>{show(active+1);start();});
 dots.forEach((el,k)=>el.addEventListener('click',()=>{show(k);start();}));
 container?.addEventListener('mouseenter',stop);container?.addEventListener('mouseleave',start);
 container?.addEventListener('focusin',stop);container?.addEventListener('focusout',e=>{if(!container.contains(e.relatedTarget))start();});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());show(0);start();
 const audio=document.querySelector('.lofi-audio');
 const play=document.querySelector('.lofi-play');
 const mute=document.querySelector('.lofi-mute');
 const volume=document.querySelector('.lofi-volume');
 if(audio&&play&&mute&&volume){
   audio.volume=Number(volume.value)/100;
   const update=()=>{const running=!audio.paused;play.textContent=running?'Ⅱ':'▶';play.setAttribute('aria-label',running?'Pausar música':'Reproducir música');play.setAttribute('aria-pressed',String(running));mute.textContent=audio.muted||audio.volume===0?'×':'♪';};
   play.addEventListener('click',async()=>{if(audio.paused){try{await audio.play();}catch(err){play.title='No se pudo reproducir el archivo. Comprueba assets/lofi-original.mp3';}}else audio.pause();update();});
   mute.addEventListener('click',()=>{audio.muted=!audio.muted;update();});
   volume.addEventListener('input',()=>{audio.volume=Number(volume.value)/100;audio.muted=false;update();});
   audio.addEventListener('pause',update);audio.addEventListener('play',update);update();
 }
})();
