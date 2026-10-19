// Next 16.3.8's static exporter joins segment paths with Windows backslashes,
// but its URL encoder only replaces forward slashes. Publish URL-shaped aliases
// for those files so Link navigation/prefetch does not request missing payloads.
// No node_modules changes; this is a no-op when Next exports flat paths correctly.
import { readdir, copyFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const root = join(process.cwd(), 'out');
let copied = 0;
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) { await visit(path); continue; }
    const parts = relative(root, path).split(sep);
    const start = parts.findIndex((part) => part.startsWith('__next.'));
    if (start < 0 || start === parts.length - 1 || !entry.name.endsWith('.txt')) continue;
    const destination = join(root, ...parts.slice(0, start), parts.slice(start).join('.'));
    await copyFile(path, destination);
    copied++;
  }
}
await visit(root);
console.log(`Static segment URL aliases: ${copied}`);
