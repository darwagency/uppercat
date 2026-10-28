import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';

const logos = JSON.parse(readFileSync('data/darw-logos.json', 'utf8'));

test('all 14 client marks export with names and lightweight transparent WebP variants', async () => {
  assert.equal(logos.length, 14);
  assert.equal(new Set(logos.map(logo => logo.slug)).size, 14);
  let bytes = 0;
  for (const logo of logos) {
    assert.ok(logo.name && !logo.name.includes('provisional'));
    for (const src of [logo.src, logo.src1x]) {
      assert.ok(existsSync(`out${src}`), `Missing exported logo: ${src}`);
      const image = sharp(`out${src}`);
      const meta = await image.metadata();
      assert.equal(meta.format, 'webp');
      assert.equal(meta.hasAlpha, true);
      if (logo.contrastVariant) {
        const stats = await sharp(`out${src}`).stats();
        assert.ok(stats.channels[3].mean < (logo.slug === 'fusion-sushi' ? 60 : 95), `Opaque matte introduced in ${logo.name}`);
      }
      // A transparent safety border prevents any mark touching the cell edges.
      const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      for (let x = 0; x < info.width; x++) {
        assert.equal(data[x * 4 + 3], 0);
        assert.equal(data[((info.height - 1) * info.width + x) * 4 + 3], 0);
      }
      for (let y = 0; y < info.height; y++) {
        assert.equal(data[(y * info.width) * 4 + 3], 0);
        assert.equal(data[(y * info.width + info.width - 1) * 4 + 3], 0);
      }
    }
    bytes += logo.bytes2x;
  }
  assert.ok(bytes < 500_000, 'Client strip should not ship multi-megabyte logo masters');
  const html = readFileSync('out/principal-2.html', 'utf8');
  for (const logo of logos) assert.ok(html.includes(`alt="${logo.name}"`), `Missing logo name: ${logo.name}`);
});
