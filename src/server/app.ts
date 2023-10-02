import { createServerAdapter } from "@whatwg-node/server";
import { createServer } from "http";
import { Router } from "itty-router";

const router = Router();

router.get("/static/:path+", async (req) => (await import("./routes/static.ts")).GET(req));
router.get("/", async () => (await import("./routes/home.tsx")).GET());

const adapter = createServerAdapter(async (req) => {
  try {
    return await router.handle(req);
  } catch (err) {
    console.log(err);
    return new Response(null, {
      status: 500,
    });
  }
});

const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT || 3000);

createServer(adapter).listen(PORT, HOST, () => {
  console.log();
  console.log(`Listening on http://${HOST}:${PORT}`);
});