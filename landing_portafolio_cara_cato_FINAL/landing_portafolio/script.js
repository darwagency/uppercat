(() => {
  'use strict';
  const images = window.SITE_IMAGES || {};
  const details = window.PROJECT_INFO || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function setImage(slot, key, eager = false) {
    if (!slot) return;
    slot.querySelector(':scope > img')?.remove();
    slot.classList.remove('has-image');
    slot.dataset.image = key;
    const path = images[key];
    if (!path || typeof path !== 'string') return;
    const img = document.createElement('img');
    img.alt = slot.dataset.alt || '';
    img.src = path;
    img.loading = eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.onload = () => slot.classList.add('has-image');
    img.onerror = () => { img.remove(); slot.classList.remove('has-image'); };
    slot.prepend(img);
  }
  document.querySelectorAll('[data-image]').forEach(slot => setImage(slot, slot.dataset.image, !!slot.closest('.hero-slide')));

  // Header navigation
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const closeNav = () => { navLinks.classList.remove('is-open'); navToggle.setAttribute('aria-expanded','false'); navToggle.setAttribute('aria-label','Abrir menú'); };
  navToggle?.addEventListener('click', () => {
    const open = !navLinks.classList.contains('is-open');
    navLinks.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded',String(open));
    navToggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  // Hero autoplay: 2.5s, seamless modulo wrap; navigation resets the timer.
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dot')];
  let currentSlide = 0, heroTimer;
  const hero = document.querySelector('.hero-carousel');
  function showSlide(n) {
    currentSlide = ((n % slides.length) + slides.length) % slides.length;
    slides.forEach((slide,i) => { const active=i===currentSlide; slide.classList.toggle('is-active',active); slide.setAttribute('aria-hidden',String(!active)); });
    dots.forEach((dot,i) => { dot.classList.toggle('is-active',i===currentSlide); dot.setAttribute('aria-current',String(i===currentSlide)); });
  }
  function stopHero() { clearInterval(heroTimer); }
  function startHero() { stopHero(); if (!reduceMotion && !document.hidden) heroTimer = setInterval(() => showSlide(currentSlide+1),2500); }
  document.querySelector('.hero-prev')?.addEventListener('click',()=>{showSlide(currentSlide-1);startHero();});
  document.querySelector('.hero-next')?.addEventListener('click',()=>{showSlide(currentSlide+1);startHero();});
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);startHero();}));
  hero?.addEventListener('focusin',stopHero);
  hero?.addEventListener('focusout',e=>{ if(!hero.contains(e.relatedTarget))startHero(); });
  hero?.addEventListener('mouseenter',stopHero);
  hero?.addEventListener('mouseleave',startHero);
  document.addEventListener('visibilitychange',()=>document.hidden?stopHero():startHero());
  startHero();

  // Genuine infinite looping scroll tracks. Group is repeated on both sides.
  // Recenter by exactly one group-width, so there is no visible jump.
  const loops = [];
  const autoSpeeds = { 'brands': 32, 'packaging': 24, 'illustrations': 22, 'social-row-top': 47, 'social-row-bottom': -43, 'testimonials': -28 };
  for (const viewport of document.querySelectorAll('[data-loop]')) {
    const track = viewport.querySelector('.loop-track');
    const original = track?.querySelector('.loop-group');
    if (!original) continue;
    const before=original.cloneNode(true), after=original.cloneNode(true);
    for (const copy of [before,after]) {
      copy.setAttribute('aria-hidden','true');
      copy.querySelectorAll('a,button,[tabindex]').forEach(el=>el.setAttribute('tabindex','-1'));
      copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
    }
    track.prepend(before); track.append(after);
    const state={viewport, original, unit:0, dragging:false, hovered:false, pauseUntil:0, speed:autoSpeeds[viewport.dataset.loop]||0, lastDrag:0};
    function measure(reset=false) {
      const oldUnit=state.unit;
      const phase=oldUnit?(viewport.scrollLeft-oldUnit)/oldUnit:0;
      state.unit=original.getBoundingClientRect().width;
      if (state.unit) viewport.scrollLeft=state.unit + (reset?0:clamp(phase,-.9,.9)*state.unit);
    }
    measure(true);
    state.measure=measure;
    let resetting=false;
    viewport.addEventListener('scroll',()=>{
      if (resetting || !state.unit) return;
      resetting=true;
      if (viewport.scrollLeft < state.unit*.5) {viewport.scrollLeft+=state.unit;if(pointer)pointer.start+=state.unit;}
      else if(viewport.scrollLeft > state.unit*1.5) {viewport.scrollLeft-=state.unit;if(pointer)pointer.start-=state.unit;}
      resetting=false;
    },{passive:true});

    let pointer=null;
    viewport.addEventListener('dragstart', e=>e.preventDefault());
    viewport.addEventListener('pointerdown',e=>{
      if(e.button!==0 && e.pointerType==='mouse') return;
      pointer={id:e.pointerId,x:e.clientX,start:viewport.scrollLeft,moved:false};
      state.dragging=true;
      state.pauseUntil=performance.now()+1800;
    });
    viewport.addEventListener('pointermove',e=>{
      if(!pointer || e.pointerId!==pointer.id)return;
      const dx=e.clientX-pointer.x;
      if(!pointer.moved && Math.abs(dx)>6) {
        pointer.moved=true; viewport.classList.add('is-dragging');
        try {viewport.setPointerCapture(e.pointerId);} catch(_){}
      }
      if(pointer.moved) {
        viewport.scrollLeft=pointer.start-dx;
        if(e.cancelable) e.preventDefault();
      }
    });
    const finish=e=>{
      if(!pointer || e.pointerId!==pointer.id)return;
      if(pointer.moved) state.lastDrag=performance.now();
      pointer=null;
      state.dragging=false;
      state.pauseUntil=performance.now()+2100;
      viewport.classList.remove('is-dragging');
      if(viewport.hasPointerCapture(e.pointerId))viewport.releasePointerCapture(e.pointerId);
    };
    viewport.addEventListener('pointerup',finish);
    viewport.addEventListener('pointercancel',finish);
    viewport.addEventListener('click',e=>{
      if(performance.now()-state.lastDrag<350) {e.preventDefault();e.stopImmediatePropagation();}
    },true);
    viewport.addEventListener('mouseenter',()=>state.hovered=true);
    viewport.addEventListener('mouseleave',()=>state.hovered=false);
    viewport.addEventListener('focusin',()=>state.pauseUntil=performance.now()+2200);
    viewport.addEventListener('keydown',e=>{
      if(e.target!==viewport || !['ArrowRight','ArrowLeft'].includes(e.key))return;
      e.preventDefault(); viewport.scrollLeft+=(e.key==='ArrowRight'?1:-1)*Math.min(300,viewport.clientWidth*.65);
      state.pauseUntil=performance.now()+2100;
    });
    loops.push(state);
  }
  // Recalculate actual widths when viewport changes. Avoid resize-loop.
  let resizeTimer;
  window.addEventListener('resize',()=>{ clearTimeout(resizeTimer); resizeTimer=setTimeout(()=>loops.forEach(l=>l.measure()),130); });

  // Accessible arrows advance a full packaging column, even after many loops.
  const pack=loops.find(l=>l.viewport.dataset.loop==='packaging');
  function movePackaging(sign) {
    if(!pack)return;
    const card=pack.original.querySelector('.packaging-project');
    const gap=parseFloat(getComputedStyle(pack.original).gap)||0;
    pack.viewport.scrollBy({left: sign*(card.getBoundingClientRect().width+gap),behavior: reduceMotion?'instant':'smooth'});
    pack.pauseUntil=performance.now()+1600;
  }
  document.querySelector('[data-gallery-prev]')?.addEventListener('click',()=>movePackaging(-1));
  document.querySelector('[data-gallery-next]')?.addEventListener('click',()=>movePackaging(1));

  // Carrusel de habilidades: avance por flechas y arrastre directo sobre cada tarjeta.
  const skills=loops.find(l=>l.viewport.dataset.loop==='skills');
  function moveSkills(sign) {
    if(!skills) return;
    const card=skills.original.querySelector('.skill-card');
    const width=card.getBoundingClientRect().width + (parseFloat(getComputedStyle(skills.original).gap)||0);
    skills.viewport.scrollBy({left: sign*width,behavior:reduceMotion?'instant':'smooth'});
    skills.pauseUntil=performance.now()+1400;
  }
  document.querySelector('.skills-prev')?.addEventListener('click',()=>moveSkills(-1));
  document.querySelector('.skills-next')?.addEventListener('click',()=>moveSkills(1));

  function resizeSkills() {
    if(!skills)return;
    const w=skills.viewport.clientWidth;
    const gap=10;
    const card=innerWidth > 760 ? (w-2*gap)/3 : w*.76;
    skills.viewport.style.setProperty('--card-width',Math.max(185,card).toFixed(1)+'px');
    skills.measure(true);
  }
  resizeSkills();
  window.addEventListener('resize',()=>setTimeout(resizeSkills,150));

  // Animation drive (only auto rows; mouse hover, drag, focus or modal pauses).
  let lastFrame=0;
  function tick(now) {
    let dt=lastFrame?Math.min(48,now-lastFrame):16;lastFrame=now;
    if(!reduceMotion && !document.hidden && !document.body.classList.contains('modal-open')) {
      for(const l of loops) {
        if(!l.speed || l.dragging || ((l.hovered || l.viewport.contains(document.activeElement)) && !l.viewport.classList.contains('social-loop')) || now<l.pauseUntil)continue;
        l.viewport.scrollLeft+=l.speed*dt/1000;
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Cuatro menús: scroll bidireccional + cuatro pestañas SIEMPRE accesibles.
  const menuTrack=document.querySelector('.menu-scroll-track');
  const deck=document.querySelector('.menus-accordion');
  const menuItems=[...document.querySelectorAll('.menu-item')];
  let selectedMenu=-1;
  function setMenu(i) {
    i=clamp(i,0,3); if(selectedMenu===i) return;
    selectedMenu=i;
    menuItems.forEach((item,j)=>{
      const active=j===i;
      item.classList.toggle('is-open',active);
      item.querySelector('.menu-trigger').setAttribute('aria-expanded',String(active));
      item.querySelector('.menu-symbol').textContent=active?'−':'+';
      item.querySelector('.menu-panel').setAttribute('aria-hidden',String(!active));
    });
  }
  function updateMenus() {
    if(!menuTrack || !deck) return;
    const trackR=menuTrack.getBoundingClientRect();
    const travel=Math.max(1,trackR.height-deck.getBoundingClientRect().height);
    const progress=clamp((-trackR.top)/travel,0,1);
    setMenu(Math.round(progress*3));
  }
  menuItems.forEach((item,i)=>item.querySelector('.menu-trigger').addEventListener('click',()=>{
    // Al elegir una pestaña, saltar hasta el tramo de scroll correspondiente.
    const rect=menuTrack.getBoundingClientRect();
    const target=window.scrollY+rect.top+Math.max(0,menuTrack.offsetHeight-deck.offsetHeight)*(i/3);
    setMenu(i);
    window.scrollTo({top:target,behavior:reduceMotion?'instant':'smooth'});
  }));
  let scrollQueued=false;
  window.addEventListener('scroll',()=>{
    if(scrollQueued)return;
    scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;updateMenus();updateIndex();});
  },{passive:true});
  window.addEventListener('resize',updateMenus);
  updateMenus();

  // Lightbox for illustration and social posts.
  const modal=document.getElementById('project-modal');
  const modalImage=document.getElementById('modal-image');
  const modalPlaceholder=document.getElementById('modal-placeholder');
  const title=document.getElementById('modal-title');
  const cat=document.getElementById('modal-category');
  const desc=document.getElementById('modal-description');
  let previouslyFocused;
  function openModal(key) {
    previouslyFocused=document.activeElement;
    const item=details[key] || {title:key,category:'PROYECTO',description:'Agrega una descripción en project-data.js'};
    title.textContent=item.title;cat.textContent=item.category;desc.textContent=item.description;
    const path=images[key];
    modalImage.hidden=!path;modalPlaceholder.hidden=!!path;
    if(path) {modalImage.src=path;modalImage.alt=item.title;modalImage.onerror=()=>{modalImage.hidden=true;modalPlaceholder.hidden=false;};}
    modal.hidden=false; document.body.classList.add('modal-open');
    modal.querySelector('.project-modal-close').focus();
  }
  function closeModal() {
    if(modal.hidden)return;
    modal.hidden=true;modalImage.removeAttribute('src');document.body.classList.remove('modal-open');
    previouslyFocused?.focus?.({preventScroll:true});
  }
  modal.querySelectorAll('[data-modal-close]').forEach(btn=>btn.addEventListener('click',closeModal));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeNav();closeIndex();}});
  // Do not select when dragging horizontally; only an intentional click.
  document.querySelectorAll('.social-loop').forEach(row=>row.addEventListener('click',e=>{
    const post=e.target.closest('[data-project]');if(post)openModal(post.dataset.project);
  }));
  const feature=document.querySelector('.feature-viewer');
  let selected='illustrationMain';
  const thumbs=document.querySelector('.illustration-loop');
  thumbs?.addEventListener('click',e=>{
    const thumb=e.target.closest('[data-illustration]');if(!thumb)return;
    selected=thumb.dataset.illustration;
    setImage(feature,selected,true);
    feature.dataset.project=selected;
    feature.dataset.alt=`Ilustración seleccionada ${selected}`;
    feature.querySelector('.slot-caption').textContent=`ILUSTRACIÓN / ${selected.replace('illustration','').padStart(2,'0')}`;
    thumbs.querySelectorAll('[data-illustration]').forEach(el=>el.classList.toggle('is-selected',el.dataset.illustration===selected));
  });
  feature?.addEventListener('click',()=>openModal(selected));

  // Sidebar index: highlights current location; click jumps to anchors.
  const index=document.querySelector('.side-index');
  const ixToggle=index?.querySelector('.side-index-toggle');
  const ixLinks=[...document.querySelectorAll('[data-section-link]')];
  function closeIndex() {index?.classList.remove('is-open'); ixToggle?.setAttribute('aria-expanded','false');}
  ixToggle?.addEventListener('click',()=>{
    const open=!index.classList.contains('is-open');index.classList.toggle('is-open',open);ixToggle.setAttribute('aria-expanded',String(open));
  });
  ixLinks.forEach(a=>a.addEventListener('click',closeIndex));
  function updateIndex() {
    let active='inicio';
    for(const a of ixLinks){
      const el=document.getElementById(a.dataset.sectionLink);
      if(el && el.getBoundingClientRect().top <= innerHeight*.46)active=a.dataset.sectionLink;
    }
    ixLinks.forEach(a=>{const on=a.dataset.sectionLink===active;a.classList.toggle('is-current',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  }
  updateIndex();
  const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
})();
