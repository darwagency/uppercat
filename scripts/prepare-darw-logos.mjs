import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceRoot = path.resolve('entregables/logos-web-2026-10-28');
const destination = path.resolve('public/images/darw/clients');
const entries = JSON.parse(await readFile(path.join(sourceRoot, 'fuentes.json'), 'utf8'));
await mkdir(destination, { recursive: true });
const report = [];
for (const entry of entries) {
  const input = path.join(sourceRoot, '01-sin-fondo', `${entry.slug}.png`);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] < 12) continue;
    left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  if (right < left) throw new Error(`Empty logo: ${entry.slug}`);
  let source = input;
  if (['sushi-torii', 'fusion-sushi'].includes(entry.slug)) {
    const white = path.join(sourceRoot, '02-fondo-blanco', `${entry.slug}.png`);
    const alpha = await sharp(input).extractChannel('alpha').toBuffer();
    const rgb = await sharp(white).removeAlpha().png().toBuffer();
    source = await sharp(rgb).joinChannel(alpha).png().toBuffer();
  }
  const limits = entry.slug === 'pizzarella' ? [320, 180] : ['racingcars', 'outlet-de-la-construccion'].includes(entry.slug) ? [184, 184] : [416, 200];
  const crop = { left, top, width: right - left + 1, height: bottom - top + 1 };
  const artwork = await sharp(source).extract(crop).resize(limits[0], limits[1], { fit: 'inside', withoutEnlargement: true }).png().toBuffer();
  const size = await sharp(artwork).metadata();
  const canvas = await sharp({ create: { width: 440, height: 224, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: artwork, left: Math.floor((440 - size.width) / 2), top: Math.floor((224 - size.height) / 2) }]).png().toBuffer();
  const filename = `${entry.slug}.webp`;
  await sharp(canvas).webp({ lossless: true, effort: 6 }).toFile(path.join(destination, filename));
  const smaller = `${entry.slug}-1x.webp`;
  await sharp(canvas).resize(220, 112).webp({ lossless: true, effort: 6 }).toFile(path.join(destination, smaller));
  const full = await readFile(path.join(destination, filename));
  const small = await readFile(path.join(destination, smaller));
  report.push({ slug: entry.slug, name: entry.name, src: `/images/darw/clients/${filename}`, src1x: `/images/darw/clients/${smaller}`, width: 440, height: 224, crop, artwork: { width: size.width, height: size.height }, bytes2x: full.length, bytes1x: small.length, source: `01-sin-fondo/${entry.slug}.png`, contrastVariant: ['sushi-torii', 'fusion-sushi'].includes(entry.slug) });
}
await writeFile('data/darw-logos.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ logos: report.length, totalBytes2x: report.reduce((sum, x) => sum + x.bytes2x, 0), totalBytes1x: report.reduce((sum, x) => sum + x.bytes1x, 0) }));
