import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { site, whatsappUrl, products, productUrl, promotions } from '../data/site.ts';

const home = readFileSync('out/index.html', 'utf8');
const shop = readFileSync('out/tienda.html', 'utf8');
const images = JSON.parse(readFileSync('data/images.json', 'utf8'));

test('WhatsApp directs every inquiry to the artist and preserves the complete message', () => {
  const message = '¡Hola! Quiero "Ilustración & arte". ¿Hay stock?';
  const url = new URL(whatsappUrl(message));
  assert.equal(url.pathname, '/56933457166');
  assert.equal(url.searchParams.get('text'), message);
  assert.equal(whatsappUrl('Hola', ''), null);
  assert.equal(whatsappUrl('Hola', '123'), null);
  assert.equal(new URL(whatsappUrl('Hola', '+56 9 3345 7166')).pathname, '/56933457166');
  products.forEach((product) => {
    const link = new URL(productUrl(product));
    assert.equal(link.pathname, '/56933457166');
    assert.ok(link.searchParams.get('text').includes(product.name));
  });
  assert.equal(new Set(promotions.map((p) => whatsappUrl(p.message))).size, 3);
});

test('all content and product inquiries are present in the static HTML before hydration', () => {
  for (const html of [home, shop]) {
    assert.match(html, /lang="es-CL"/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /<main id="contenido"/);
    assert.ok(html.includes(site.email));
    assert.doesNotMatch(html, /tumarca\.cl|wa\.me\/\?text|CARA<br\/>CATO|10% DE DESCUENTO|Cargando catálogo/);
    const contactLinks = [...html.matchAll(/href="(https:\/\/wa\.me\/[^" ]+)"/g)];
    assert.ok(contactLinks.length > 0);
    contactLinks.forEach(([, href]) => assert.equal(new URL(href.replaceAll('&amp;', '&')).pathname, '/56933457166'));
  }
  assert.equal((shop.match(/class="shop-product"/g) || []).length, 5);
  products.forEach((product) => assert.ok(shop.includes(`Consultar por ${product.name} en WhatsApp`)));
  assert.ok(existsSync('out/404.html'));
  assert.ok(existsSync('out/audio/lofi-original.mp3'));
  assert.ok(existsSync('out/tienda/__next.tienda.__PAGE__.txt'), 'Nested route prefetch payload must resolve on static hosting, including Windows builds');
});

test('local navigation anchors resolve and assigned local media files exist', () => {
  for (const html of [home, shop]) {
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(anchor), `Missing anchor: ${anchor}`);
  }
  assert.equal(Object.keys(images).length, 60);
  for (const [key, src] of Object.entries(images)) {
    if (!src) continue;
    assert.ok(src.startsWith('/images/'), `${key}: images must use local /images/ paths`);
    assert.ok(existsSync(resolve('public', `.${src}`)), `${key}: missing ${src}`);
  }
});

test('the HTML reference keeps its layout and does not acquire additional navigation', () => {
  assert.doesNotMatch(home, /class="(?:hero-copy|hero-ornament|rail-toolbar|project-card-caption|footer-invite|testimonial-empty|section-star)"/);
  assert.doesNotMatch(shop, /class="(?:rail-toolbar|catalog-notice|shop-topline|footer-invite)"/);
  assert.match(home, /class="menu-scroll-track"/);
  assert.match(home, /class="skills-carousel-shell"/);
  assert.match(home, /class="side-index-items"/);
  assert.equal((home.match(/class="brand-logo"/g) || []).length, 10);
  assert.equal((home.match(/class="testimonial"/g) || []).length, 9);
  assert.equal((home.match(/media-slot social-post/g) || []).length, 10);
  assert.equal((home.match(/media-slot illustration-thumb/g) || []).length, 8);
});
