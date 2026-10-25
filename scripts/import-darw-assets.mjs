import { mkdir, writeFile, readFile } from 'node:fs/promises';
import sharp from 'sharp';

// Public portfolio assets selected from darw.cl on 2026-10-25.
const assets = {
  'darw-logo': '/LOGOTIPO%20DARW%20BLANCO%20VECTORIAL.svg',
  'burger-hero': '/images/gastronomia-cases/rural-burger/live/cheese-burger.webp',
  'burger-packaging': '/images/gastronomia-cases/rural-burger/live/packaging-scene-v2.webp',
  'burger-box': '/images/gastronomia-cases/rural-burger/packaging-box.webp',
  'burger-bag': '/images/gastronomia-cases/rural-burger/packaging-bag.webp',
  'burger-brand': '/images/gastronomia-cases/rural-burger/brand-03.webp',
  'burger-type': '/images/gastronomia-cases/rural-burger/brand-04.webp',
  'burger-character': '/images/gastronomia-cases/rural-burger/mascot-burger.webp',
  'burger-launch-1': '/images/gastronomia-cases/rural-burger/launch-01.png',
  'burger-launch-2': '/images/gastronomia-cases/rural-burger/launch-02.png',
  'burger-logo': '/images/home-case-logos/rural-burger-cover.webp',
  'poke-logo': '/images/home-case-logos/ruralpoke-cover.webp',
  'poke-character': '/images/ruralpoke-portfolio/character-01.webp',
  'poke-character-2': '/images/ruralpoke-portfolio/character-02.webp',
  'poke-campaign': '/images/ruralpoke-portfolio/hero-anywhere.webp',
  'poke-may-1': '/images/ruralpoke-portfolio/may-01.webp',
  'poke-may-2': '/images/ruralpoke-portfolio/may-02.webp',
  'poke-birthday': '/images/ruralpoke-portfolio/birthday-01.webp',
  'poke-story': '/images/ruralpoke-portfolio/daily-open.webp',
  'poke-cyber': '/images/ruralpoke-portfolio/cyber-01.webp',
  'fusion-colors': '/images/gastronomia-cases/fusion-sushi/brand-0006.webp',
  'fusion-application': '/images/gastronomia-cases/fusion-sushi/brand-0013.webp',
  'fusion-story': '/images/gastronomia-cases/fusion-sushi/story-delivery.webp',
  'fusion-logo': '/images/gastronomia-cases/fusion-sushi/brand-0001.webp',
  'equilibrium-logo': '/images/home-case-logos/equilibrium-cover.webp',
  'equilibrium-web': '/work/sites/equilibrium-chonchi-2026-08-14.jpg',
  'torii-web': '/work/sites/sushi-torii-producto-2026-08-14.jpg',
  'scandrive-web': '/work/scandrive/mockups/digital-product-workbench.webp',
  'monteverde-web': '/work/sites/colegio-monte-verde-2026-08-14.jpg',
  'fuego-web': '/work/sites/fuego-de-patio-2026-08-14.jpg',
};
await mkdir('public/images/darw', { recursive: true });
await mkdir('docs/darw', { recursive: true });
const manifest = [];
for (const [name, path] of Object.entries(assets)) {
  const url = `https://darw.cl${path}`;
  const cachedFile = `/images/darw/${name}.${path.endsWith(".svg") ? "svg" : "webp"}`;
  const cached = await readFile(`public${cachedFile}`).catch(() => null);
  if (cached) { manifest.push({ name, source: url, file: cachedFile, bytes: cached.length }); continue; }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const svg = path.endsWith('.svg');
  const output = svg ? bytes : await sharp(bytes).rotate().resize({ width: 1600, height: 1800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  const file = `/images/darw/${name}.${svg ? 'svg' : 'webp'}`;
  await writeFile(`public${file}`, output);
  manifest.push({ name, source: url, file, bytes: output.length });
  console.log(`${name}: ${Math.round(output.length / 1024)} KB`);
}
await writeFile('docs/darw/asset-sources.json', JSON.stringify(manifest, null, 2) + '\n');
