import createHash from "@emotion/hash";
import esbuild from "esbuild";
import { existsSync } from "fs";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { posix } from "path";
import { buildImage } from "./utils/build-image";
import { execute } from "./utils/exec";
import { buildScript } from "./utils/build-script";

const ASSET_DIRECTORIES = [
  "node_modules",
  "public",
];

const IMAGE_EXTENSIONS = [
  ".avif",
  ".jpeg",
  ".jpg",
  ".png",
  ".tif",
  ".tiff",
  ".webp",
];

const CSS_EXTENSIONS = [
  ".css",
];

const SCRIPT_EXTENSIONS = [
  ".ts",
];

async function cleanup() {
  await rm("dist", {
    force: true,
    recursive: true,
  });
  
  await mkdir("dist", {
    recursive: true,
  });
}

async function buildApp() {
  let appPath = "src/server/app.ts";

  if (!existsSync(appPath)) {
    // .tsx
    appPath += "x";
  }

  await esbuild.build({
    entryPoints: [
      {
        in: appPath,
        out: "app",
      }
    ],
    outdir: "dist",
    loader: {
      ".ts": "tsx",
      ".tsx": "tsx",
    },
    format: "cjs",
    jsxSideEffects: true,
    bundle: true,
    packages: "external",
  });
}

async function buildAssets() {
  const pattern = /\"[^\"]+\"/g;
  const appPath = "dist/app.js";

  let appData = await readFile(appPath, "utf8");

  const matches = appData.match(pattern);

  if (!matches) {
    return;
  }

  for (const match of matches) {
    const [filePath, query] = match.slice(1, -1).split("?");
    const isAssetDir = ASSET_DIRECTORIES.some((dir) => filePath.startsWith(dir));

    if (!isAssetDir || !existsSync(filePath)) {
      continue;
    }

    const { base, ext, name } = posix.parse(filePath);

    if (IMAGE_EXTENSIONS.includes(ext)) {
      const image = await buildImage(filePath, query);
      const fileData = image.data;
      const fileHash = createHash(fileData.toString("utf8"));
      const routePath = posix.join("/static", fileHash, `${name}${image.ext}`);
      const dstPath = posix.join("dist", routePath);
      const dstDir = posix.dirname(dstPath);

      await mkdir(dstDir, {
        recursive: true,
      });

      await writeFile(dstPath, fileData);
      appData = appData.replaceAll(match, `"${routePath}"`);
      console.log(">", routePath);
    } else if (CSS_EXTENSIONS.includes(ext)) {
      const rand = createHash(Math.random().toString(16));
      const temp = `dist/${rand}.css`;

      await execute(`tailwindcss -i ${filePath} -o ${temp} --minify`);
      
      const fileData = await readFile(temp, "utf8");
      const fileHash = createHash(fileData);
      const routePath = posix.join("/static", fileHash, base);
      const dstPath = posix.join("dist", routePath);
      const dstDir = posix.dirname(dstPath);

      await rm(temp, {
        force: true,
      });

      await mkdir(dstDir, {
        recursive: true,
      });

      await writeFile(dstPath, fileData);
      appData = appData.replaceAll(match, `"${routePath}"`);
      console.log(">", routePath);
    } else if (SCRIPT_EXTENSIONS.includes(ext)) {
      const fileData = await buildScript(filePath);
      const fileHash = createHash(fileData.toString("utf8"));
      const routePath = posix.join("/static", fileHash, `${name}.js`);
      const dstPath = posix.join("dist", routePath);
      const dstDir = posix.dirname(dstPath);

      await mkdir(dstDir, {
        recursive: true,
      });

      await writeFile(dstPath, fileData);
      appData = appData.replaceAll(match, `"${routePath}"`);
      console.log(">", routePath);
    } else {
      const fileData = await readFile(filePath);
      const fileHash = createHash(fileData.toString("utf8"));
      const routePath = posix.join("/static", fileHash, base);
      const dstPath = posix.join("dist", routePath);
      const dstDir = posix.dirname(dstPath);

      await mkdir(dstDir, {
        recursive: true,
      });

      await writeFile(dstPath, fileData);
      appData = appData.replaceAll(match, `"${routePath}"`);
      console.log(">", routePath);
    }
  }

  await writeFile(appPath, appData, "utf8");
}

async function main() {
  await cleanup();

  await buildApp();
  await buildAssets();
}

main();