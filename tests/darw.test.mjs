import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { darwProjects } from '../data/darw.ts';

const html = readFileSync('out/principal-2.html', 'utf8');

test('Darw exports with its own identity and contact destination', () => {
  assert.match(html, /<title>Darw — Ideas que se hacen ver<\/title>/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(html, /uppercat@gmail.com|wa\.me\/56933457166|class="site-header"|class="footer-shell"/);
  assert.match(html, /wa\.me\/56926341222/);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(id), `Missing anchor ${id}`);
  assert.ok(existsSync('out/principal-2/__next.principal-2.__PAGE__.txt'));
});

test('every selectable Darw project has locally exported images and a source case', () => {
  assert.equal(new Set(darwProjects.map(project => project.id)).size, darwProjects.length);
  for (const project of darwProjects) {
    assert.equal(new URL(project.url).hostname, 'darw.cl');
    assert.ok(project.images.length > 0);
    for (const image of project.images) {
      assert.ok(existsSync(`out${image.src}`), `${project.name}: missing ${image.src}`);
      assert.ok(image.alt.length > 10);
    }
  }
});
