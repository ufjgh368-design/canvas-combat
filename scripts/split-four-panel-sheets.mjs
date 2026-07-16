import { mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = process.cwd();
const sharp = require(resolve(root, "node_modules", ".pnpm", "sharp@0.34.5", "node_modules", "sharp"));
const sourceDir = resolve(root, "work", "new-artist-sheets");
const outputDir = resolve(root, "assets", "characters");
const frameNames = ["gallery", "battle", "ultimate", "ko"];

await mkdir(outputDir, { recursive: true });
const sheets = (await readdir(sourceDir)).filter((name) => name.endsWith("-alpha.png"));

for (const sheet of sheets) {
  const artistId = sheet.replace("-alpha.png", "");
  const source = resolve(sourceDir, sheet);
  const metadata = await sharp(source).metadata();

  for (let index = 0; index < frameNames.length; index += 1) {
    const left = Math.floor((metadata.width * index) / frameNames.length);
    const right = Math.floor((metadata.width * (index + 1)) / frameNames.length);
    const cropped = await sharp(source)
      .extract({ left, top: 0, width: right - left, height: metadata.height })
      .png()
      .toBuffer();
    const trimmed = await sharp(cropped)
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    const frameName = frameNames[index];

    if (frameName === "gallery") {
      await sharp(trimmed)
        .resize({ width: 900, height: 1120, fit: "inside", withoutEnlargement: true })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(resolve(outputDir, `${artistId}-gallery.png`));
    } else {
      await sharp(trimmed)
        .resize({ width: 780, height: 820, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 88, alphaQuality: 96, smartSubsample: true })
        .toFile(resolve(outputDir, `${artistId}-${frameName}.webp`));
    }
  }
}

console.log(`Created ${sheets.length * frameNames.length} independent artist frames.`);
