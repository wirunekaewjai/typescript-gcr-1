import { posix } from "path";
import { execute } from "./utils/exec";

async function main() {
  const ext = [
    "css",
    "ico",
    "jpeg",
    "jpg",
    "js",
    "json",
    "jsx",
    "png",
    "ts",
    "tsx",
    "webp",
  ];

  await execute(`nodemon --ignore dist -e ${ext} --exec "npm run build && npm start"`);
}

main();
