import dotenv from "dotenv";
import { mkdir, readFile, writeFile } from "fs/promises";
import { posix } from "path";
import { execute } from "./utils/exec";

const COPY_FILE_PATHS = [
  "Dockerfile",
];

async function createPackage() {
  const pkg = await readFile("package.json", "utf8");
  const pkgJson = JSON.parse(pkg);

  const data = {
    name: pkgJson.name,
    dependencies: pkgJson.dependencies ?? {},
  };

  const filePath = "dist/package.json";
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  console.log(">", filePath);
}

async function copyFiles() {
  for (const filePath of COPY_FILE_PATHS) {
    const dstPath = posix.join("dist", filePath);
    const dstDir = posix.dirname(dstPath);

    await mkdir(dstDir, {
      recursive: true,
    });

    const fileData = await readFile(filePath);
    await writeFile(dstPath, fileData);
    console.log(">", dstPath);
  }
}

async function main() {
  console.time("deploy time");

  await execute("npm run build");
  await createPackage();
  await copyFiles();

  dotenv.config();

  const {
    GCP_PROJECT_ID,
    GCR_SERVICE_NAME,
    GCR_IMAGE_NAME,
    GCR_REGION,
  } = process.env;

  const image = `${GCR_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${GCR_SERVICE_NAME}/${GCR_IMAGE_NAME}:latest`;
  const buildCommand = [
    "gcloud builds submit dist",
    `--tag=${image}`,
    `--project=${GCP_PROJECT_ID}`,
  ];

  await execute(buildCommand.join(" "));

  const deployCommand = [
    `gcloud run deploy ${GCR_SERVICE_NAME}`,
    `--image=${image}`,
    `--allow-unauthenticated`,
    `--timeout=30`,
    `--cpu=1`,
    `--memory=1Gi`,
    `--cpu-boost`,
    `--min-instances=0`,
    `--max-instances=3`,
    `--region=${GCR_REGION}`,
    `--project=${GCP_PROJECT_ID}`,
  ];

  await execute(deployCommand.join(" "));
  console.timeEnd("deploy time");
}

main();