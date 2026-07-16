import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const target = resolve(root, "public", "game");
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });

for (const file of ["index.html", "style.css", "homepage.css", "selection.css"]) {
  await cp(resolve(root, file), resolve(target, file));
}
for (const directory of ["assets", "data", "js"]) {
  await cp(resolve(root, directory), resolve(target, directory), { recursive: true });
}
