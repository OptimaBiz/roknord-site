import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
const directory = new URL("../public/images/news/", import.meta.url);
for (const name of await readdir(directory)) {
  if (!name.endsWith(".png")) continue;
  const source = new URL(name, directory);
  const full = new URL(name.replace(".png", ".webp"), directory);
  const small = new URL(name.replace(".png", "-800.webp"), directory);
  await sharp(source.pathname).webp({ quality: 82 }).toFile(full.pathname);
  await sharp(source.pathname)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(small.pathname);
  console.log(
    `${name}: ${(await stat(source)).size} → ${(await stat(full)).size} / ${(await stat(small)).size} bytes`,
  );
}
