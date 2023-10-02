import { readFile } from "fs/promises";
import { posix } from "path";
import sharp from "sharp";

function parseNumber(value: string | null) {
  if (value) {
    const n = Number(value);

    if (n > 0) {
      return n;
    }
  }

  return null;
}

function isValidWidth(value: number | null): value is number {
  return typeof value === "number" && value >= 16 && value <= 4096 && value % 16 === 0;
}

function isValidQualtity(value: number | null): value is number {
  return typeof value === "number" && value >= 10 && value <= 100;
}

export async function buildImage(filePath: string, query: string) {
  const params = new URLSearchParams(query);
  const w = params.get("w");
  const q = params.get("q");
  
  let ext = posix.extname(filePath);
  let width = parseNumber(w);
  let quality = parseNumber(q);

  if (!isValidWidth(width)) {
    width = 4096;
  }

  if (!isValidQualtity(quality)) {
    quality = 90;
  }

  const isJpeg = ext === ".jpg" || ext === ".jpeg";
  const format = isJpeg ? "jpeg" : "png";

  const buffer = await readFile(filePath);

  let t = sharp(buffer);

  t = t.resize({
    width,
    withoutEnlargement: true,
  });

  t = t[format]({
    quality,
  });

  ext = isJpeg ? ".jpg" : ".png";

  return {
    data: await t.toBuffer(),
    ext,
  };
}