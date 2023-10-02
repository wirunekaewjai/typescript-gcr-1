import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { IRequest } from "itty-router";
import { posix } from "path";
import { getMime } from "../../utils/mime";

export const GET = async (req: IRequest) => {
  const url = new URL(req.url);
  const src = posix.join(".", url.pathname);

  if (!existsSync(src)) {
    return new Response(null, {
      status: 404,
    });
  }

  const ext = posix.extname(src).toLowerCase();
  const mime = getMime(ext);
  const buffer = await readFile(src);

  return new Response(buffer, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": mime,
    },
  });
};