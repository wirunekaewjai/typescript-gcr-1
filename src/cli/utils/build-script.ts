import createHash from "@emotion/hash";
import esbuild from "esbuild";
import { readFile, rm } from "fs/promises";

export async function buildScript(filePath: string) {
  const rand = createHash(Math.random().toString(16));
  const temp = `dist/${rand}.js`;

  await esbuild.build({
    entryPoints: [
      {
        in: filePath,
        out: rand,
      },
    ],
    outdir: "dist",
    loader: {
      ".ts": "tsx",
      ".tsx": "tsx",
    },
    format: "esm",
    bundle: true,
    minifyWhitespace: true,
  });

  const fileData = await readFile(temp);

  await rm(temp, {
    force: true,
  });

  return fileData;
}