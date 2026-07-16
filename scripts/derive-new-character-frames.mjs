import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = process.cwd();
const sharp = require(resolve(root, 'node_modules', '.pnpm', 'sharp@0.34.5', 'node_modules', 'sharp'));
const ids = ['botticelli', 'titian', 'renoir', 'gauguin', 'munch', 'matisse', 'pollock'];

for (const id of ids) {
  const source = resolve(root, 'assets', 'characters', `${id}-gallery.png`);
  const output = (frame) => resolve(root, 'assets', 'characters', `${id}-${frame}.webp`);
  const base = () => sharp(source).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).resize({ width: 720, height: 760, fit: 'inside' });
  await base().webp({ quality: 86, alphaQuality: 95 }).toFile(output('battle'));
  await base().modulate({ brightness: 1.08, saturation: 1.28 }).sharpen().webp({ quality: 88, alphaQuality: 95 }).toFile(output('ultimate'));
  await base().grayscale().modulate({ brightness: .72 }).webp({ quality: 82, alphaQuality: 95 }).toFile(output('ko'));
}

console.log(`Created ${ids.length * 3} character animation frames.`);
