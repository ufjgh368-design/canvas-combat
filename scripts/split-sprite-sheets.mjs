import { readdir, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = process.cwd();
const sharp = require(resolve(root, "node_modules", ".pnpm", "sharp@0.34.5", "node_modules", "sharp"));
const sourceDir = resolve(root, "work", "sprite-sheets");
const outputDir = resolve(root, "assets", "characters");
const frameNames = ["battle", "ultimate", "ko"];

await mkdir(outputDir, { recursive: true });
const sheets = (await readdir(sourceDir)).filter((name) => name.endsWith("-sheet-alpha.png"));

for (const sheet of sheets) {
  const artistId = sheet.replace("-sheet-alpha.png", "");
  const source = resolve(sourceDir, sheet);
  const metadata = await sharp(source).metadata();
  const panelWidth = Math.floor(metadata.width / 3);

  for (let index = 0; index < 3; index += 1) {
    const left = index * panelWidth;
    const width = index === 2 ? metadata.width - left : panelWidth;
    const cropped = await sharp(source)
      .extract({ left, top: 0, width, height: metadata.height })
      .png()
      .toBuffer();
    const panel = await sharp(cropped)
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    await sharp(panel)
      .resize({ width: 720, height: 760, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84, alphaQuality: 95, smartSubsample: true })
      .toFile(resolve(outputDir, `${artistId}-${frameNames[index]}.webp`));
  }
}

console.log(`Created ${sheets.length * 3} independent character frames.`);
